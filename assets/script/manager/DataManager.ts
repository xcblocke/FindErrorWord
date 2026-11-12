// Created by carolsail

import { ENUM_GAME_STATUS } from '../Enum';
import { shuffle } from '../Utils';
import Word from '../game/Word';

const STORAGE_KEY = 'CC_GHOST_WORD'
const TIMER_SECONDS = 90
export default class DataManager {

    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<DataManager>()
    }
    // 游戏模式(0: 诗词成语，1：去多余字，2：找错别字，3：文字填空，4：用词不当)
    mode: number = 2
    // 游戏状态
    status: ENUM_GAME_STATUS = ENUM_GAME_STATUS.UNRUNING
    // 加载进度
    loadingRate: number = 0
    // 声音开启
    _isMusicOn: boolean = true
    _isSoundOn: boolean = true
    // 更多游戏
    games: any[] = [
        {title: '消灭星星', icon: 'xiao2d', appid: 'wxefd5a4ddd8e31b44', url: 'https://store.cocos.com/app/detail/4183'},
        {title: '实况足球杯', icon: 'football', appid: 'wx0c16e9d7f9e87dac', url: 'https://store.cocos.com/app/detail/4221'},
        {title: '爬了个爬', icon: 'stairway', appid: 'wx025bcf3a316bfa27', url: 'https://store.cocos.com/app/detail/4314'},
        {title: '咩了个咩3D', icon: 'xiao3d', appid: 'wx5841e5a26082b380', url: 'https://store.cocos.com/app/detail/4148'},
        {title: '经典泡泡龙', icon: 'bubble', appid: 'wxcc2f90afdf28ae3b', url: 'https://store.cocos.com/app/detail/4370'},
    ]
    // 关卡记录
    levels: any[] = [
        {current: 1, max: 1},
        {current: 1, max: 1},
        {current: 1, max: 1},
        {current: 1, max: 1},
        {current: 1, max: 1}
    ]
    // 搜集数
    targetCount: number = 0
    targetCollect: number = 0
    // 血量
    lifeCount: number = 3
    lifeCost: number = 0
    // 计时器
    timer: number = TIMER_SECONDS
    // 提示
    tipHandNode: cc.Node = null
    // 游戏场景所有词
    words: Word[] = []
    // 天空模式答案
    fillAnswer: Word[] = []
    // 震动
    isShaking: boolean = false
    // 上一次激励视
    lastVideoTime: number = 0

    get isMusicOn(){
        return this._isMusicOn
    }

    set isMusicOn(data: boolean){
        this._isMusicOn = data
    }

    get isSoundOn(){
        return this._isSoundOn
    }

    set isSoundOn(data: boolean){
        this._isSoundOn = data
    }

    reset(){
        this.status = ENUM_GAME_STATUS.UNRUNING
        this.targetCount = 0
        this.targetCollect = 0
        this.lifeCost = 0
        this.timer = TIMER_SECONDS
        this.tipHandNode = null
        this.words = []
        this.fillAnswer = []
        this.isShaking = false
    }

    save(){
        cc.sys.localStorage.setItem(STORAGE_KEY, JSON.stringify({
            isSoundOn: this.isSoundOn,
            isMusicOn: this.isMusicOn,
            levels: this.levels
        }))
    }

    restore(){
        const _data = cc.sys.localStorage.getItem(STORAGE_KEY) as any
        try {
            const data = JSON.parse(_data)
            this.isMusicOn = data?.isMusicOn === false ? false : true
            this.isSoundOn = data?.isSoundOn === false ? false : true
            this.levels = data?.levels || [
                {current: 1, max: 1},
                {current: 1, max: 1},
                {current: 1, max: 1},
                {current: 1, max: 1},
                {current: 1, max: 1}
            ]
        } catch {
            this.isMusicOn = true
            this.isSoundOn = true
            this.levels = [
                {current: 1, max: 1},
                {current: 1, max: 1},
                {current: 1, max: 1},
                {current: 1, max: 1},
                {current: 1, max: 1}
            ]
        }
    }

    getLevelInfo(){
        return this.levels[this.mode]
    }

    setLevelInfo(current: number = 0, max: number = 0){
        const level = this.levels[this.mode]
        level.current = current
        level.max = max
        this.save()
    }

    // 填空模式相关方法
    getFillAnswerForStrArr(){
        const str = []
        for(let i = 0; i < DataManager.instance.fillAnswer.length; i++){
            const wc = DataManager.instance.fillAnswer[i]
            str.push(wc.getCurrentStr())
        }
        shuffle(str)
        return str
    }

    getFillAnswerCurrent(){
        return DataManager.instance.fillAnswer.find(answer => answer.isActive)
    }

    moveFillAnswer(){
        const currentIndex = DataManager.instance.fillAnswer.findIndex(answer => answer.isActive)
        const nextIndex = currentIndex + 1
        if(nextIndex >= DataManager.instance.fillAnswer.length) return
        DataManager.instance.fillAnswer[currentIndex].isActive = false
        DataManager.instance.fillAnswer[currentIndex].setActiveStyle()
        DataManager.instance.fillAnswer[nextIndex].isActive = true
        DataManager.instance.fillAnswer[nextIndex].setActiveStyle()
    }
}
