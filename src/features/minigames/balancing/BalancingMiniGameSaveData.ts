import {UpgradeListSaveData} from "../../../engine/upgrades/UpgradeListSaveData";

export class BalancingMiniGameSaveData {
    focus: number;
    upgrades: UpgradeListSaveData;


    constructor(focus: number, upgrades: UpgradeListSaveData) {
        this.focus = focus;
        this.upgrades = upgrades;
    }
}
