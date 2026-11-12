// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
import SdkManager from "../manager/SdkManager";
import ToastManager from "../manager/ToastManager";
import { StaticInstance } from "../StaticInstance";
import { formatSeconds } from "../Utils";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainLayer extends BaseLayer {

    btn_setting: cc.Node = null
    btn_tip: cc.Node = null
    node_tips: cc.Node = null
    node_lifes: cc.Node = null
    node_notices: cc.Node = null
    node_timer: cc.Node = null
    sound_timer_index: number = -1

    onLoad(){
        this.btn_setting = cc.find('btn_setting', this.node)
        this.btn_setting.on('click', this.onSettingClick, this)
        this.btn_tip = cc.find('btn_tip', this.node)
        this.btn_tip.on('click', this.onTipClick, this)
        this.node_tips = cc.find('tips', this.node)
        this.node_lifes = cc.find('lifes', this.node)
        this.node_notices = cc.find('notices', this.node)
        this.node_timer = cc.find('timer', this.node)
    }

    onDestroy(){
        this.btn_setting.off('click', this.onSettingClick, this)
        this.btn_tip.off('click', this.onTipClick, this)
    }

    onSettingClick(){
        if(DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING) return
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING_MAIN)
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        StaticInstance.uiManager.setMainTimer(false)
        StaticInstance.uiManager.setMainTimerSound(false)
    }

    onTipClick(){
        if(DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING) return
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)

        // 防止白嫖，间隔60s
        const now = new Date().getTime()
        if(SdkManager.instance.videoId == '' && (now - DataManager.instance.lastVideoTime < 30000)){
            ToastManager.instance.show('白嫖过于频繁，稍后再试', {gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255)})
            return
        }

        StaticInstance.uiManager.setMainTimer(false)
        StaticInstance.uiManager.setMainTimerSound(false)
        SdkManager.instance.showVideoAd(()=>{
            DataManager.instance.lastVideoTime = new Date().getTime()
            StaticInstance.uiManager.setMainTimer(true)
            StaticInstance.uiManager.setMainTimerSound(true)
            StaticInstance.gameManager.onGameTip()
        }, ()=>{
            StaticInstance.uiManager.setMainTimer(true)
            StaticInstance.uiManager.setMainTimerSound(true)
            ToastManager.instance.show('视频播放中断', {gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255)})
        })
    }

    setTips(isInit: boolean = true){
        // count
        if(isInit){
            const count = this.node_tips.getChildByName('count')
            count.getComponent(cc.Label).string = `${DataManager.instance.targetCount}`
            count.scale = 0.5
            const act = cc.scaleTo(0.3, 1)
            cc.tween(count).then(act).start()
            const total = this.node_tips.getChildByName('total')
            total.getComponent(cc.Label).string = `${DataManager.instance.targetCount}`
            const collect = this.node_tips.getChildByName('collect')
            collect.getComponent(cc.Label).string = '0'
            const tip1 = this.node_tips.getChildByName('tip1')
            const tip2 = this.node_tips.getChildByName('tip2')
            let label1 = '找到'
            let label2 = '个错误的字'
            if(DataManager.instance.mode == 1) {
                label1 = '找出'
                label2 = '个多余的字'
            }
            if(DataManager.instance.mode == 3) {
                label1 = '找出'
                label2 = '处用词不当'
            }
            if(DataManager.instance.mode == 4) {
                label1 = '填入'
                label2 = '个正确的词'
            }
            tip1.getComponent(cc.Label).string = `${label1}`
            tip2.getComponent(cc.Label).string = `${label2}`
        }else{
            // collected
            const collect = this.node_tips.getChildByName('collect')
            collect.getComponent(cc.Label).string = `${DataManager.instance.targetCollect}`
            collect.scale = 0.5
            const act = cc.scaleTo(0.3, 1)
            cc.tween(collect).then(act).start()
        }
    }

    setLifes(isInit: boolean = true){
        const lifes = this.node_lifes.children
        if(isInit){
            DataManager.instance.lifeCount = lifes.length
            for(let i = 0; i < lifes.length; i++){
                lifes[i].getChildByName('on').active = true
                lifes[i].getChildByName('off').active = false
            }
        }else{
            for(let i = lifes.length - 1; i >= 0; i--){
                const life = lifes[i]
                if(!life.getChildByName('off').active){
                    life.getChildByName('on').active = false
                    life.getChildByName('off').active = true
                    life.scale = 0.5
                    const act = cc.scaleTo(0.3, 1)
                    cc.tween(life).then(act).start()
                    break
                }
            }
        }
    }

    setNotice(index: number, status: boolean){
        this.node_notices.opacity = status ? 255 : 0
        if(status){
            const notices = this.node_notices.children
            for(let i = 0; i < notices.length; i++){
                if(i == index){
                    notices[i].active = true
                }else{
                    notices[i].active = false
                }
            }
            this.node_notices.stopAllActions()
            this.node_notices.x = 560
            const act = cc.moveTo(0.5, 0, this.node_notices.y)
            cc.tween(this.node_notices).then(act).start()
        }
    }

    onTimerStart(){
        const label = this.node_timer.getComponent(cc.Label)
        label.string = formatSeconds(`${DataManager.instance.timer}`, 'i:s')
        this.unscheduleAllCallbacks()
        this.schedule(()=>{
            if(DataManager.instance.timer <= 1) this.unscheduleAllCallbacks()
            DataManager.instance.timer--
            if(DataManager.instance.timer < 0) DataManager.instance.timer = 0
            label.string = formatSeconds(`${DataManager.instance.timer}`, 'i:s')
            this.onTimerSoundStart()
            if(DataManager.instance.timer <= 0) StaticInstance.gameManager.onGameOver()
        }, 1)
    }

    onTimerStop(){
        this.unscheduleAllCallbacks()
    }

    async onTimerSoundStart(){
        if(DataManager.instance.timer <= 5 && DataManager.instance.timer > 0 && this.sound_timer_index < 0) {
            this.sound_timer_index = await AudioManager.instance.playSound(ENUM_AUDIO_CLIP.TIMER, true)
        }
    }

    onTimerSoundStop(){
        AudioManager.instance.stopSound(this.sound_timer_index)
        this.sound_timer_index = -1
    }
}
