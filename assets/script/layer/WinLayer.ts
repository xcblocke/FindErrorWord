// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import SdkManager from "../manager/SdkManager";
import ToastManager from "../manager/ToastManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WinLayer extends BaseLayer {

    node_panel: cc.Node = null
    btn_next: cc.Node = null
    btn_share: cc.Node = null
    eff_particle: cc.ParticleSystem = null

    onLoad(){
        this.node_panel = cc.find('style/panel', this.node)
        this.btn_next = cc.find('buttons/btn_next', this.node_panel)
        this.btn_share = cc.find('buttons/btn_share', this.node_panel)
        this.btn_next.on('click', this.onNextClick, this)
        this.btn_share.on('click', this.onShareClick, this)
        this.eff_particle = this.node.getChildByName('particle').getComponent(cc.ParticleSystem)
    }

    onDestroy(){
        this.btn_next.off('click', this.onNextClick, this)
        this.btn_share.off('click', this.onShareClick, this)
    }

    onEnable(){
        this.zoomIn(this.node_panel)
        this.eff_particle.resetSystem()
    }

    onNextClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.WIN, false)
        StaticInstance.transitionsManager.play({from: ENUM_UI_TYPE.WIN, to: ENUM_UI_TYPE.MAIN}, ()=>{
            StaticInstance.gameManager.onGameStart()
        })
    }

    onShareClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        if(SdkManager.instance.getPlatform()){
            SdkManager.instance.activeShare()
        }else{
            ToastManager.instance.show('仅支持小游戏平台', {gravity: 'TOP', bg_color: cc.color(226, 69, 109, 255)})
        }
    }
}
