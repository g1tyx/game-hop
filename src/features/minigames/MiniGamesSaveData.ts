import {DummyMiniGameSaveData} from "./dummy/DummyMiniGameSaveData";
import {MarketingMiniGameSaveData} from "./marketing/MarketingMiniGameSaveData";
import {BalancingMiniGameSaveData} from "./balancing/BalancingMiniGameSaveData";

export class MiniGamesSaveData {
    dummy: DummyMiniGameSaveData;
    marketing: MarketingMiniGameSaveData;
    balancing: BalancingMiniGameSaveData;

    constructor(dummy: DummyMiniGameSaveData, marketing: MarketingMiniGameSaveData, balancing: BalancingMiniGameSaveData) {
        this.dummy = dummy;
        this.marketing = marketing;
        this.balancing = balancing;
    }
}
