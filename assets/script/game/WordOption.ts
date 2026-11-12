import { ENUM_GAME_STATUS } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import { toXY } from "../Utils";
import DataManager from "../manager/DataManager";
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
const {ccclass, property} = cc._decorator;

@ccclass
export default class WordOption extends cc.Component {

    nodeLabel: cc.Node = null

    init(str: string){
        this.nodeLabel = this.node.getChildByName('label')
        this.setLabel(str)
        this.node.on('touchstart', this.onTouch, this)
    }

    onTouch(){
        if(DataManager.instance.isShaking || DataManager.instance.status == ENUM_GAME_STATUS.UNRUNING) return
        if(DataManager.instance.tipHandNode){
            DataManager.instance.tipHandNode.removeFromParent()
            DataManager.instance.tipHandNode = null
        }
        const pos = toXY(this.node, StaticInstance.gameManager.rootEffect)
        StaticInstance.effectManager.play('Touch', {pos})
        const strChoose = this.getLabel()
        const target = DataManager.instance.getFillAnswerCurrent()
        const strTarget = target.getCurrentStr()
        let isTarget = false
        if(strChoose == strTarget){
            isTarget = true
            // 删选项
            StaticInstance.effectManager.play('Bomb', {pos})
            this.node.removeFromParent()
            // 显示答案
            const pos2 = toXY(target.nodeCurrent, StaticInstance.gameManager.rootEffect)
            StaticInstance.effectManager.play('Collect', {pos: pos2})
            target.setFillStr(strChoose)
            // 移动到下一个active选项
            DataManager.instance.moveFillAnswer()
        }
        StaticInstance.gameManager.onGameCheck(isTarget)
    }

    getLabel(){
        return this.nodeLabel.getComponent(cc.Label).string
    }

    setLabel(data: string){
        this.nodeLabel.getComponent(cc.Label).string = `${data}`
    }

}