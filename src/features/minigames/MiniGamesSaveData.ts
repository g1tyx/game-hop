import {MarketingMiniGameSaveData} from "./marketing/MarketingMiniGameSaveData";
import {BalancingMiniGameSaveData} from "./balancing/BalancingMiniGameSaveData";
import {DesignMiniGameSaveData} from "./design/DesignMiniGameSaveData";
import {BugFixingMiniGameSaveData} from "./bugfixing/BugFixingMiniGameSaveData";

export class MiniGamesSaveData {
    marketing: MarketingMiniGameSaveData;
    balancing: BalancingMiniGameSaveData;
    design: DesignMiniGameSaveData;
    bugFixing: BugFixingMiniGameSaveData;

    constructor(marketing: MarketingMiniGameSaveData, balancing: BalancingMiniGameSaveData, design: DesignMiniGameSaveData, bugFixing: BugFixingMiniGameSaveData) {
        this.marketing = marketing;
        this.balancing = balancing;
        this.design = design;
        this.bugFixing = bugFixing;
    }
}
