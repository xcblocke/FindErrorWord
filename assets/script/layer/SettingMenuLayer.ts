// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import DataManager from "../manager/DataManager";
import SdkManager from "../manager/SdkManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingMenuLayer extends BaseLayer {

    node_panel: cc.Node = null
    btn_music: cc.Node = null
    btn_sound: cc.Node = null
    btn_close: cc.Node = null

    onLoad(){
        this.node_panel = cc.find('style/panel', this.node)
        this.btn_music = cc.find('buttons/btn_music', this.node_panel)
        this.btn_sound = cc.find('buttons/btn_sound', this.node_panel)
        this.btn_close = cc.find('btn_close', this.node_panel)
        this.btn_music.on('click', this.onMusicClick, this)
        this.btn_sound.on('click', this.onSoundClick, this)
        this.btn_close.on('click', this.onCloseClick, this)
    }

    onDestroy(){
        this.btn_music.off('click', this.onMusicClick, this)
        this.btn_sound.off('click', this.onSoundClick, this)
        this.btn_close.off('click', this.onCloseClick, this)
    }

    onEnable(){
        SdkManager.instance.showInterstitialAd()
        this.zoomIn(this.node_panel)
        this.rendorMusic()
        this.rendorSound()
    }

    onCloseClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING_MENU, false)
    }

    onSoundClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.isSoundOn = !DataManager.instance.isSoundOn
        DataManager.instance.save()
        this.rendorSound()
    }

    onMusicClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.isMusicOn = !DataManager.instance.isMusicOn
        DataManager.instance.save()
        if(DataManager.instance.isMusicOn){
            AudioManager.instance.playMusic()
        }else{
            AudioManager.instance.stopMusic()
        }
        this.rendorMusic()
    }

    rendorMusic(){
        this.btn_music.getChildByName('on').active = DataManager.instance.isMusicOn
        this.btn_music.getChildByName('off').active = !DataManager.instance.isMusicOn
    }
    
    rendorSound(){
        this.btn_sound.getChildByName('on').active = DataManager.instance.isSoundOn
        this.btn_sound.getChildByName('off').active = !DataManager.instance.isSoundOn
    }
}
