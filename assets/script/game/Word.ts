import { ENUM_GAME_STATUS } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import { toXY } from "../Utils";
import DataManager from "../manager/DataManager";
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
const {ccclass, property} = cc._decorator;

const OFFSET_X = 0
const OFFSET_Y = 20

@ccclass
export default class Word extends cc.Component {

    isTarget: boolean = false
    nodeIcon: cc.Node = null
    nodeRight: cc.Node = null
    nodeCurrent: cc.Node = null
    // 填空模式
    nodeFill: cc.Node = null
    isActive: boolean = false

    init(right: string, current: string, index: number){
        this.nodeRight = this.node.getChildByName('right')
        this.nodeCurrent = this.node.getChildByName('current')
        this.nodeIcon = this.node.getChildByName('icon')
        if(index >= 1) this.isTarget = true
        this.nodeRight.getComponent(cc.Label).string = `${right}`
        this.nodeCurrent.getComponent(cc.Label).string = `${current}`
        this.nodeCurrent.on('touchstart', this.onTouch, this)
    }

    initFill(right: string, index: number){
        this.nodeFill = this.node.getChildByName('fill')
        this.nodeCurrent = this.node.getChildByName('current')
        this.nodeCurrent.getComponent(cc.Label).string = `${right}`
        if(index >= 1) {
            if(index == 1) this.isActive = true
            this.nodeFill.active = true
            this.setActiveStyle()
        }
    }

    setPos(ix: number, iy: number){
        const x = ix * this.node.width + ix * OFFSET_X
        let y = (iy * this.node.height + iy * OFFSET_Y) * -1
        // 间隔微调
        if(iy == 2) y -= iy * 0.8
        if(iy == 3) y -= iy * 1
        if(iy == 4) y -= iy * 1.2
        if(iy == 5) y -= iy * 1
        if(iy == 6) y -= iy * 0.8
        this.node.setPosition(x, y)
    }

    onTouch(){
        if(DataManager.instance.isShaking || DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING) return
        if(DataManager.instance.tipHandNode){
            DataManager.instance.tipHandNode.removeFromParent()
            DataManager.instance.tipHandNode = null
        }
        const pos = toXY(this.nodeIcon, StaticInstance.gameManager.rootEffect)
        if(this.isTarget){
            this.offTouch()
            this.nodeIcon.active = true
            this.nodeRight.active = true
            StaticInstance.effectManager.play('Collect', {pos})
            // 用词不当模式具有连带性
            if(DataManager.instance.mode == 3){
                const index = DataManager.instance.words.findIndex(wc => wc == this)
                let tempIndex = index - 1
                while(DataManager.instance.words[tempIndex].isTarget){
                    DataManager.instance.words[tempIndex].offTouch()
                    DataManager.instance.words[tempIndex].nodeIcon.active = true
                    DataManager.instance.words[tempIndex].nodeRight.active = true
                    tempIndex--
                }
                tempIndex = index + 1
                while(DataManager.instance.words[tempIndex].isTarget){
                    DataManager.instance.words[tempIndex].offTouch()
                    DataManager.instance.words[tempIndex].nodeIcon.active = true
                    DataManager.instance.words[tempIndex].nodeRight.active = true
                    tempIndex++
                }
            }
        }else{
            StaticInstance.effectManager.play('Touch', {pos})
        }
        StaticInstance.gameManager.onGameCheck(this.isTarget)
    }

    offTouch(){
        this.nodeCurrent.off('touchstart')
    }

    isCollected(){
        return this.nodeRight.active
    }

    getCurrentStr(){
        return this.nodeCurrent.getComponent(cc.Label).string
    }

    setActiveStyle(){
        if(this.isActive){
            this.nodeFill.color = new cc.Color(96, 241, 116, 255)
        }else{
            this.nodeFill.color = new cc.Color(255, 255, 255, 255)
        }
    }

    setFillStr(data: string){
        this.nodeFill.getChildByName('label').getComponent(cc.Label).string = `${data}`
    }
}