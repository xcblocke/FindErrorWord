//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import SdkManager from "../manager/SdkManager";
import ToastManager from "../manager/ToastManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseLayer extends BaseLayer {

    node_panel: cc.Node = null
    btn_restart: cc.Node = null
    btn_share: cc.Node = null

    onLoad(){
        this.node_panel = cc.find('style/panel', this.node)
        this.btn_restart = cc.find('buttons/btn_restart', this.node_panel)
        this.btn_share = cc.find('buttons/btn_share', this.node_panel)
        this.btn_restart.on('click', this.onRestartClick, this)
        this.btn_share.on('click', this.onShareClick, this)
    }

    onDestroy(){
        this.btn_restart.off('click', this.onRestartClick, this)
        this.btn_share.off('click', this.onShareClick, this)
    }

    onEnable(){
        this.zoomIn(this.node_panel)
    }

    onRestartClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false)
        StaticInstance.transitionsManager.play({from: ENUM_UI_TYPE.LOSE, to: ENUM_UI_TYPE.MAIN}, ()=>{
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
