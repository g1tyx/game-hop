import {MarketingMiniGameSaveData} from "./marketing/MarketingMiniGameSaveData";
import {BalancingMiniGameSaveData} from "./balancing/BalancingMiniGameSaveData";
import {DesignMiniGameSaveData} from "./design/DesignMiniGameSaveData";

export class MiniGamesSaveData {
    marketing: MarketingMiniGameSaveData;
    balancing: BalancingMiniGameSaveData;
    design: DesignMiniGameSaveData;

    constructor(marketing: MarketingMiniGameSaveData, balancing: BalancingMiniGameSaveData, design: DesignMiniGameSaveData) {
        this.marketing = marketing;
        this.balancing = balancing;
        this.design = design;
    }
}
