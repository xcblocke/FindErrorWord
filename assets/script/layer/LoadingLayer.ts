// Created by carolsail 

import { ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import DataManager from "../manager/DataManager";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingLayer extends BaseLayer {

    @property(cc.Sprite)
    loading: cc.Sprite = null
    
    update(dt: number) {
        if(this.loading && this.node.active) {
            this.loading.fillRange = DataManager.instance.loadingRate
            if(DataManager.instance.loadingRate >= 1){
                // menu已加载完毕
                if(StaticInstance.uiManager.isActive(ENUM_UI_TYPE.MENU)){
                    this.hide()
                }
            }
        }
    }
}
