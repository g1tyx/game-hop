import {UpgradeListSaveData} from "../../../engine/upgrades/UpgradeListSaveData";

export class BugFixingMiniGameSaveData {
    squashed: number;
    upgrades: UpgradeListSaveData;

    constructor(squashed: number, upgrades: UpgradeListSaveData) {
        this.squashed = squashed;
        this.upgrades = upgrades;
    }
}
