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
import DataManager from "../manager/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuLayer extends BaseLayer {

    btn_setting: cc.Node = null
    btn_games: cc.Node = null
    btn_share: cc.Node = null

    onLoad(){
        this.btn_setting = cc.find('bottom/btn_setting', this.node)
        this.btn_games = cc.find('bottom/btn_games', this.node)
        this.btn_share = cc.find('bottom/btn_share', this.node)
        this.btn_setting.on('click', this.onSettingClick, this)
        this.btn_games.on('click', this.onGamesClick, this)
        this.btn_share.on('click', this.onShareClick, this)
        this.node.getChildByName('main').children.forEach((node, index)=>{
            const buttons = node.getChildByName('buttons')
            const play = buttons.getChildByName('btn_play')
            const level = buttons.getChildByName('btn_level')
            if(!play.hasEventListener('click')) play.on('click', ()=>{this.onPlayClick(index)}, this)
            if(!level.hasEventListener('click')) level.on('click', ()=>{this.onLevelClick(index)}, this)
        })
    }

    onDestroy(){
        this.btn_setting.off('click', this.onSettingClick, this)  
        this.btn_games.off('click', this.onGamesClick, this)  
        this.btn_share.off('click', this.onShareClick, this)
    }

    onPlayClick(index: number){
        DataManager.instance.mode = index
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.transitionsManager.play({from: ENUM_UI_TYPE.MENU, to: ENUM_UI_TYPE.MAIN}, ()=>{
            StaticInstance.gameManager.onGameStart()
        })
    }

    onLevelClick(index: number){
        DataManager.instance.mode = index
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LEVEL)
    }

    onSettingClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING_MENU)
    }

    onGamesClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MORE)
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
