// Created by carolsail
import { StaticInstance } from '../StaticInstance';
import { ENUM_UI_TYPE, ENUM_TRANSITION_TYPE } from '../Enum';
import ResourceManager from '../manager/ResourceManager';

const {ccclass, property} = cc._decorator;

type ITransionOptions = {
    type?: ENUM_TRANSITION_TYPE,
    from?: ENUM_UI_TYPE,
    to?: ENUM_UI_TYPE
}

@ccclass
export default class UITransitionControl extends cc.Component {

    @property
    transitionTime: number = 1

    material: cc.Material = null
    loading: boolean = false
    time: number = 0

    _inited: boolean = false
    _texture1: cc.RenderTexture = null
    _texture2: cc.RenderTexture = null
    _sprite: cc.Sprite = null
    _spriteNode: cc.Node = null
    _spriteMaterial: cc.MaterialVariant = null
    _onLoadChange: Function = null
    _onLoadFinished: Function = null


    protected onLoad(): void {
        StaticInstance.setTransitionManager(this)
    }

    init () {
        if (this._inited) return
        this._inited = true

        this.time = 0

        this._texture1 = this.createTexture()
        this._texture2 = this.createTexture()
        
        let spriteNode = cc.find('TRANSITION_SPRITE', this.node)
        if (!spriteNode) {
            spriteNode = new cc.Node('TRANSITION_SPRITE')
            this._sprite = spriteNode.addComponent(cc.Sprite)
            spriteNode.parent = this.node
        }
        else {
            this._sprite = spriteNode.getComponent(cc.Sprite)
        }
        let spriteFrame = new cc.SpriteFrame()
        spriteFrame.setTexture(this._texture1)
        this._sprite.spriteFrame = spriteFrame
       
        spriteNode.active = false
        spriteNode.scaleY = -1
        this._spriteNode = spriteNode

        this.updateSpriteMaterial()
    }

    createTexture () {
        let texture = new cc.RenderTexture()
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8)
        return texture
    }

    updateSpriteMaterial () {
        if (!this._sprite) return
        let newMaterial = cc.MaterialVariant.create(this.material, null)
        newMaterial.setProperty('texture2', this._texture2)
        newMaterial.setProperty('ratio', this._texture2.width/this._texture2.height)
        newMaterial.setProperty('screenSize', new Float32Array([this._texture2.width, this._texture2.height]))
        this._sprite.setMaterial(0, newMaterial)
        this._spriteMaterial = newMaterial
    }

    update(dt: number) {
        if (this.loading) {
            this.time += dt
            if(this.time >= this.transitionTime / 2){
                this._onLoadChange && this._onLoadChange()
                this._onLoadChange = null
            }
            if(this.time >= this.transitionTime){
                this.time = this.transitionTime
                this.loading = false
                this._onLoadFinished && this._onLoadFinished()
                this._onLoadFinished = null
            }
            this._spriteMaterial.setProperty('time', this.time / this.transitionTime)
        }
    }

    async play(options: ITransionOptions = null, changeFun?: () => void, finishedFun?: () => void){
        options = Object.assign({from: null, to: null, type: ENUM_TRANSITION_TYPE.CIRCLE}, options)
        this.material = await ResourceManager.instance.getMaterial(options.type)
        this.init()
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MASK_EMPTY)
        this._spriteNode.active = true

        this.time = 0
        this.loading = true
        this._spriteMaterial.setProperty('time', 0)

        this._onLoadChange = () => {
            if(options.from && StaticInstance.uiManager.isActive(options.from)) StaticInstance.uiManager.toggle(options.from, false)
            if(options.to && !StaticInstance.uiManager.isActive(options.to)) StaticInstance.uiManager.toggle(options.to, true)
            changeFun && changeFun()
        }

        this._onLoadFinished = () => {
            this._spriteNode.active = false
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MASK_EMPTY, false)
            finishedFun && finishedFun()
        }
    }
}
