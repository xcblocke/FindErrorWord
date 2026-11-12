// Created by carolsail 

// 状态
export enum ENUM_GAME_STATUS {
    UNRUNING = 'ur',
    RUNING = 'r'
}

// 音效
export enum ENUM_AUDIO_CLIP {
    BGM = 'bgm',
    LOSE = 'lose',
    WIN = 'win',
    TIMER = 'timer',
    CHECK_RIGHT = 'check_right',
    CHECK_WRONG = 'check_wrong',
    CLICK = 'click',
    CLICK_ITEM = 'click_item',
}

// 过场
export enum ENUM_TRANSITION_TYPE {
    CIRCLE = 'crop-circle'
}

// ui层
export enum ENUM_UI_TYPE {
    MENU = 'MenuLayer',
    MAIN = 'MainLayer',
    SETTING_MENU = 'SettingMenuLayer',
    SETTING_MAIN = 'SettingMainLayer',
    LOSE = 'LoseLayer',
    WIN = 'WinLayer',
    MORE = 'MoreLayer',
    LEVEL = 'LevelLayer',
    MASK_EMPTY = 'MaskEmptyLayer',
    MASK_Loading = 'MaskLoadingLayer'
}

// 资源
export const ENUM_RESOURCE_TYPE = ([
    {content: cc.JsonAsset, path: 'json', type: 'json', ratio: 0.4},
    {content: cc.AudioClip, path: 'audio', type: 'audio', ratio: 0.2},
    {content: cc.Prefab, path: 'prefab', type: 'prefab', ratio: 0.2},
    {content: cc.SpriteFrame, path: 'sprite', type: 'sprite', ratio: 0.1},
    {content: cc.Material, path: 'shader', type: 'shader', ratio: 0.1}
])