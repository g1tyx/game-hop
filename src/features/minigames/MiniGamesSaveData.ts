import {DummyMiniGameSaveData} from "./dummy/DummyMiniGameSaveData";
import {MarketingMiniGameSaveData} from "./marketing/MarketingMiniGameSaveData";
import {BalancingMiniGameSaveData} from "./balancing/BalancingMiniGameSaveData";
import {DesignMiniGameSaveData} from "./design/DesignMiniGameSaveData";

export class MiniGamesSaveData {
    dummy: DummyMiniGameSaveData;
    marketing: MarketingMiniGameSaveData;
    balancing: BalancingMiniGameSaveData;
    design: DesignMiniGameSaveData;

    constructor(dummy: DummyMiniGameSaveData, marketing: MarketingMiniGameSaveData, balancing: BalancingMiniGameSaveData, design: DesignMiniGameSaveData) {
        this.dummy = dummy;
        this.marketing = marketing;
        this.balancing = balancing;
        this.design = design;
    }
}
