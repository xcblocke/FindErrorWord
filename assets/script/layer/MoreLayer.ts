// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import DataManager from "../manager/DataManager";
import PoolManager from "../manager/PoolManager";
import UIScrollControl from "../plugins/UIScrollControl";
import ResourceManager from "../manager/ResourceManager";
import SdkManager from "../manager/SdkManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoreLayer extends BaseLayer {

    node_panel: cc.Node = null
    btn_close: cc.Node = null
    scroll_node: cc.Node = null
    scroll_item: cc.Node = null

    onLoad(){
        this.node_panel = cc.find('style/panel', this.node)
        this.btn_close = cc.find('btn_close', this.node_panel)
        this.scroll_node = cc.find('scroll', this.node_panel)
        this.scroll_item = PoolManager.instance.getNode('MoreItem')
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
        const games = DataManager.instance.games
        let isScrollToTop = false
        this.scroll_node.getComponent(UIScrollControl).init(this.scroll_item, games.length, cc.size(530, 110), 0, (node: cc.Node, index: number)=>{
            if(!isScrollToTop) {
                isScrollToTop = true
                this.scroll_node.getComponent(cc.ScrollView).scrollToTop()
            }
            const game = games[index]
            node.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = ResourceManager.instance.getSprite(`${game.icon}`)
            node.getChildByName('title').getComponent(cc.Label).string = `${game.title}`
            if(!node.hasEventListener('click')){
                node.on('click', () => {this.onItemClick(game)}, this)
            }else{
                node.off('click')
                node.on('click', () => {this.onItemClick(game)}, this)
            }
        }, (scroll: cc.ScrollView)=>{
            scroll.scrollToTop()
        }) 
    }

    onDisable(){}

    onItemClick(item: any){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        const url = typeof window['wx'] === 'undefined' ? `${item.url}` : `${item.appid}`
        if(url) SdkManager.instance.turnToApp(url)
    }

    onCloseClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MORE, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU)
    }
}
