// Created by carolsail

import EffectManager from "./manager/EffectManager";
import GameManager from "./manager/GameManager";
import UIManager from "./manager/UIManager";
import TransitionsManager from "./plugins/UITransitionControl";

export class StaticInstance {
    static uiManager: UIManager | undefined = undefined;
    static gameManager: GameManager | undefined = undefined;
    static effectManager: EffectManager | undefined = undefined;
    static transitionsManager: TransitionsManager | undefined = undefined

    static setUIManager(context: UIManager){
        StaticInstance.uiManager = context;
    }

    static setGameManager(context: GameManager){
        StaticInstance.gameManager = context
    }

    static setEffectManager(context: EffectManager){
        StaticInstance.effectManager = context
    }

    static setTransitionManager(context: TransitionsManager){
        StaticInstance.transitionsManager = context
    }
}