
// Created by carolsail 
const {ccclass, property} = cc._decorator;

import { ENUM_AUDIO_CLIP, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import { isChinese } from "../Utils";
import WordOption from "../game/WordOption";
import Word from "../game/Word";
import AudioManager from "./AudioManager";
import DataManager from "./DataManager";
import PoolManager from "./PoolManager";
import ResourceManager from "./ResourceManager";
import ToastManager from "./ToastManager";

@ccclass
export default class GameManager extends cc.Component {

    paper: cc.Node = null
    board: cc.Node = null
    rootEffect: cc.Node = null
    levelCount: number = 0

    onLoad () {
        StaticInstance.setGameManager(this)
        this.paper = cc.find('Stage/RootGame/Paper', this.node)
        this.board = cc.find('Stage/RootGame/Board', this.node)
        this.rootEffect = cc.find('Stage/RootEffect', this.node)
    }

    onDestroy() {}

    // 开始游戏
    onGameStart(){
        DataManager.instance.reset()
        this.initGame()
    }

    // 初始化游戏
    initGame(){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        this.paper.removeAllChildren()
        // 底板只有填空时才需要
        this.board.active = DataManager.instance.mode == 4
        this.initData()
        StaticInstance.uiManager.setMainTips()
        StaticInstance.uiManager.setMainLifes()
        StaticInstance.uiManager.setMainNotice()
        StaticInstance.uiManager.setMainTimer(true)
        DataManager.instance.status = ENUM_GAME_STATUS.RUNING
    }

    // 初始化数据
    initData(){
        // 获取json对应关卡数据
        const mode = DataManager.instance.mode
        const json = ResourceManager.instance.getJson(`mode_${mode}`)
        this.levelCount = json.length
        const levels = DataManager.instance.getLevelInfo()
        const data = json[levels.current - 1]
        this.generateData(data)
    }

    // 处理关卡数据
    generateData(data: any){
        function rightAndWrong(str: string, isFull: boolean = false){
            let inWrong: boolean = false
            let right: string[] = []
            let wrong: string[] = []
            let index: number[] = []
            let wrongNums: number = 0
            for (let i = 0; i < str.length; i++) {
                const s = str.charAt(i);
                if (s == "(") {
                    inWrong = true;
                    wrongNums++;
                    if(!isFull){
                        let count = 0;
                        for (let j = i + 1; j < str.length; j++) {
                            if (str.charAt(j) == ")") break;
                            count++;
                        }
                        for (let j = 0; j < count; j++) {
                            wrong.pop();
                            index.pop();
                        }
                    }
                } else if (s == ")") {
                    inWrong = false;
                } else {
                    if (inWrong) {
                        if(isFull) right.push(s)
                        wrong.push(s);
                        index.push(wrongNums);
                    } else {
                        right.push(s);
                        wrong.push(s);
                        index.push(0);
                    }
                }
            }
            return {right, wrong, index, wrongNums}
        }
        let startX = 0
        let startY = 0
        if(data.question){
            const obj = rightAndWrong(data.question)
            startX = Math.floor((10 - obj.right.length) / 2) 
            for(let i = 0; i < obj.wrong.length; i++){
                const word = PoolManager.instance.getNode('Word', this.paper)
                const wordComponent = word.getComponent(Word)
                wordComponent.init(obj.right[i], obj.wrong[i], obj.index[i])
                wordComponent.setPos(startX + i, startY)
                DataManager.instance.words.push(wordComponent)
            }
            startY += 1
            DataManager.instance.targetCount += obj.wrongNums
        }
        if(data.answer){
            let obj = rightAndWrong(data.answer)
            DataManager.instance.targetCount += obj.wrongNums
            if(DataManager.instance.mode == 0 || DataManager.instance.mode == 1){
                if(DataManager.instance.mode == 1) obj = rightAndWrong(data.answer, true)
                // 诗词成语找错别字, 去多余字
                // 需要文本居中，根据非中文字符进行分割，重组二维数组
                let rightArr = []
                let wrongArr = []
                let indexArr = []
                let newIndex = 0
                for(let i = 0; i < obj.right.length; i++){
                    if(!isChinese(obj.right[i])){
                        newIndex += 1
                    }else{
                        if(!rightArr[newIndex]) {
                            rightArr[newIndex] = []
                            wrongArr[newIndex] = []
                            indexArr[newIndex] = []
                        }
                        rightArr[newIndex].push(obj.right[i])
                        wrongArr[newIndex].push(obj.wrong[i])
                        indexArr[newIndex].push(obj.index[i])
                    }
                }
                for(let m = 0; m < wrongArr.length; m++){
                    const wrongs = wrongArr[m]
                    const rights = rightArr[m]
                    const indexs = indexArr[m]
                    startX = Math.floor((10 - wrongs.length) / 2) 
                    for(let n = 0; n < wrongs.length; n++){
                        const word = PoolManager.instance.getNode('Word', this.paper)
                        const wordComponent = word.getComponent(Word)
                        wordComponent.init(rights[n], wrongs[n], indexs[n])
                        wordComponent.setPos(startX + n, startY)
                        DataManager.instance.words.push(wordComponent)
                    }
                    startY += 1
                }
            }else if(DataManager.instance.mode == 2 || DataManager.instance.mode == 3){
                // 文章找错别字, 用词不当
                startX = 2
                for(let i = 0; i < obj.wrong.length; i++){
                    const word = PoolManager.instance.getNode('Word', this.paper)
                    const wordComponent = word.getComponent(Word)
                    wordComponent.init(obj.right[i], obj.wrong[i], obj.index[i])
                    wordComponent.setPos((startX + i) % 10, Math.floor((startX + i) / 10) + startY)
                    DataManager.instance.words.push(wordComponent)
                }
            }else if(DataManager.instance.mode == 4){
                obj = rightAndWrong(data.answer, true)
                // 词语填空
                startX = 2
                for(let i = 0; i < obj.wrong.length; i++){
                    const word = PoolManager.instance.getNode('Word', this.paper)
                    const wordComponent = word.getComponent(Word)
                    wordComponent.initFill(obj.right[i], obj.index[i])
                    wordComponent.setPos((startX + i) % 10, Math.floor((startX + i) / 10) + startY)
                    DataManager.instance.words.push(wordComponent)
                    if(wordComponent.nodeFill.active) DataManager.instance.fillAnswer.push(wordComponent)
                }
                // 下面board中选项
                this.board.removeAllChildren()
                const options = DataManager.instance.getFillAnswerForStrArr()
                for(let i = 0; i < options.length; i++){
                    const option = PoolManager.instance.getNode('Option', this.board)
                    const optionComponent = option.getComponent(WordOption)
                    optionComponent.init(options[i])
                }
            }
        }
    }

    // 检查
    onGameCheck(isTarget: boolean){
        if(isTarget){
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CHECK_RIGHT)
            DataManager.instance.targetCollect += 1
            // 收集数
            StaticInstance.uiManager.setMainTips(false)
            if(DataManager.instance.targetCollect >= DataManager.instance.targetCount){
                this.onGameOver(ENUM_UI_TYPE.WIN)
            }
        }else{
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CHECK_WRONG)
            DataManager.instance.lifeCost += 1
            DataManager.instance.isShaking = true
            StaticInstance.effectManager.shake(this.paper, 0.5, ()=>{
                DataManager.instance.isShaking = false
            }, false)
            // 扣血
            StaticInstance.uiManager.setMainLifes(false)
            if(DataManager.instance.lifeCost >= DataManager.instance.lifeCount){
                this.onGameOver(ENUM_UI_TYPE.LOSE)
            }
        }
    }

    // 游戏结算
    onGameOver(ui: ENUM_UI_TYPE = ENUM_UI_TYPE.LOSE){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        StaticInstance.uiManager.setMainTimer(false)
        StaticInstance.uiManager.setMainTimerSound(false)
        let duration = 1
        if(ui == ENUM_UI_TYPE.LOSE){
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.LOSE)
            StaticInstance.uiManager.setMainNotice(0, true)
        }else{
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.WIN)
            StaticInstance.effectManager.play('EndFireLeft', {pos: cc.v2(-cc.winSize.width / 2, 0)})
            StaticInstance.effectManager.play('EndFireRight', {pos: cc.v2(cc.winSize.width / 2, 0)})
            StaticInstance.effectManager.play('WinStar', {pos: cc.v2(0, 0)})
            StaticInstance.uiManager.setMainNotice(1, true)
            // 关卡累加
            const levels = DataManager.instance.getLevelInfo()
            let currentLevel = levels.current + 1
            currentLevel = Math.min(currentLevel, this.levelCount)
            let maxLevel = levels.max
            if(currentLevel > maxLevel) maxLevel = currentLevel
            DataManager.instance.setLevelInfo(currentLevel, maxLevel)
        }
        this.scheduleOnce(()=>{
            StaticInstance.uiManager.toggle(ui)
        }, duration)
    }

    // 游戏提示
    onGameTip(){
        if(!DataManager.instance.tipHandNode){
            if(DataManager.instance.mode == 4){
                const answer = DataManager.instance.getFillAnswerCurrent()
                const str = answer.getCurrentStr()
                const options = this.board.children
                let target = null
                for(let i = 0; i < options.length; i++){
                    const op = options[i]
                    const tip = op.getComponent(WordOption).getLabel()
                    if(tip == str) {
                        target = op
                        break
                    }
                }
                const hand = PoolManager.instance.getNode('Hand', target)
                DataManager.instance.tipHandNode = hand
                return
            }
            const wordComponent = DataManager.instance.words.find(wc => !wc.isCollected() && wc.isTarget)
            if(!wordComponent) return
            let v3 = cc.v3(25, -25, 0)
            const hand = PoolManager.instance.getNode('Hand', wordComponent.node, v3)
            DataManager.instance.tipHandNode = hand
        }else{
            ToastManager.instance.show('已发放技能点', {gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255)})
        }
    }
}
