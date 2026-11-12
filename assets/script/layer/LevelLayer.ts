//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import BaseLayer from "./Baselayer";
import DataManager from "../manager/DataManager";
import ResourceManager from "../manager/ResourceManager";
import AudioManager from "../manager/AudioManager";
import PoolManager from "../manager/PoolManager";
import UIScrollControl from "../plugins/UIScrollControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelLayer extends BaseLayer {

    node_panel: cc.Node = null
    btn_close: cc.Node = null
    scroll_node: cc.Node = null
    scroll_item: cc.Node = null

    onLoad(){
        this.node_panel = cc.find('style/panel', this.node)
        this.btn_close = cc.find('btn_close', this.node_panel)
        this.scroll_node = cc.find('scroll', this.node_panel)
        this.scroll_item = PoolManager.instance.getNode('LevelItem')
        this.btn_close.on('click', this.onCloseClick, this)
    }

    onDestroy(){
        this.btn_close.off('click', this.onCloseClick, this)
    }

    onEnable(){
        this.zoomIn(this.node_panel)
        this.rendor() 
    }

    rendor(){
        const mode = DataManager.instance.mode
        const levels = ResourceManager.instance.getJson(`mode_${mode}`)
        const levelInfo = DataManager.instance.getLevelInfo()
        let isScrollToTop = false
        this.scroll_node.getComponent(UIScrollControl).init(this.scroll_item, levels.length, cc.size(530, 110), 0, (node: cc.Node, index: number)=>{
            if(!isScrollToTop) {
                isScrollToTop = true
                this.scroll_node.getComponent(cc.ScrollView).scrollToTop()
            }
            const data = levels[index]
            const nodeLevel = node.getChildByName('level')
            nodeLevel.getChildByName('label').getComponent(cc.Label).string = `${index + 1}`
            const nodeTitle = node.getChildByName('title')
            nodeTitle.getComponent(cc.Label).string = `${data.title}`
            const nodeLock = node.getChildByName('lock')
            const nodeShade = node.getChildByName('bgshade')
            if(index + 1 <= levelInfo.max){
                nodeLock.active = false
                nodeShade.active = false
                if(!node.hasEventListener('click')){
                    node.on('click', () => {this.onItemClick(index+1)}, this)
                }else{
                    node.off('click')
                    node.on('click', () => {this.onItemClick(index+1)}, this)
                }
            }else{
                nodeLock.active = true
                nodeShade.active = true
            }
        }, (scroll: cc.ScrollView)=>{
            scroll.scrollToOffset(cc.v2(0, levelInfo.max * 110 - (scroll.node.height / 2)), 0.05)
        })
    }

    onItemClick(level: number){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        const levelInfo = DataManager.instance.getLevelInfo()
        DataManager.instance.setLevelInfo(level, levelInfo.max)
        StaticInstance.transitionsManager.play({from: ENUM_UI_TYPE.LEVEL, to: ENUM_UI_TYPE.MAIN}, ()=>{
            StaticInstance.gameManager.onGameStart()
        })
    }

    onCloseClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LEVEL, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU)
    }
}
