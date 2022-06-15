import {UpgradeListSaveData} from "../../../engine/upgrades/UpgradeListSaveData";

export class DesignMiniGameSaveData {
    correct: number;
    upgrades: UpgradeListSaveData;

    constructor(correct: number, upgrades: UpgradeListSaveData) {
        this.correct = correct;
        this.upgrades = upgrades;
    }
}
