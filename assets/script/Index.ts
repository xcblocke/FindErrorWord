//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html

import { ENUM_RESOURCE_TYPE, ENUM_UI_TYPE } from './Enum';
import DataManager from './manager/DataManager';
import SdkManager from './manager/SdkManager';
import AudioManager from "./manager/AudioManager";
import ResourceManager from "./manager/ResourceManager";
import { StaticInstance } from './StaticInstance';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    onLoad() {
        cc.view.setResizeCallback(()=>this.responsive())
        this.responsive()
        DataManager.instance.loadingRate = 0
    }

    async start(){
        // 加载资源
        for(const index in ENUM_RESOURCE_TYPE){
            const resource = ENUM_RESOURCE_TYPE[index]
            await ResourceManager.instance.loadRes(resource)
        }
        // 加载ui
        StaticInstance.uiManager.init()
        // 读档
        DataManager.instance.restore()
        // 播放音乐
        AudioManager.instance.playMusic()
        // 加载sdk
        SdkManager.instance.initAudioEndListener()
        SdkManager.instance.passiveShare()
        SdkManager.instance.initVideoAd()
        SdkManager.instance.initBannerAd()
        SdkManager.instance.initInterstitialAd()
        // 操作ui
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, true, ()=>{
            DataManager.instance.loadingRate = 1
        })
    }

    // 屏幕响应式
    responsive(){
        const designSize = cc.view.getDesignResolutionSize();
        const viewSize = cc.view.getFrameSize();
        const setFitWidth = ()=>{
            cc.Canvas.instance.fitHeight = false;
            cc.Canvas.instance.fitWidth = true;
        }

        const setFitHeight = ()=>{
            cc.Canvas.instance.fitHeight = true;
            cc.Canvas.instance.fitWidth = false;
        }

        const setFitBoth = ()=>{
            cc.Canvas.instance.fitHeight = true;
            cc.Canvas.instance.fitWidth = true;
        }

        const designRatio = designSize.width / designSize.height
        const viewRatio = viewSize.width / viewSize.height
        if(designRatio < 1){
            if(viewRatio < 1){
                if(viewRatio > designRatio){
                    setFitBoth()
                }else{
                    setFitWidth()
                }
            }else{
                setFitBoth()
            }
        }else{
            if(viewRatio > 1){
                if(viewRatio < designRatio){
                    setFitBoth()
                }else{
                    setFitHeight()
                }
            }else{
                setFitBoth()
            }
        }
    }
}
