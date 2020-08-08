import {DummyMiniGameSaveData} from "./dummy/DummyMiniGameSaveData";
import {MarketingMiniGameSaveData} from "./marketing/MarketingMiniGameSaveData";

export class MiniGamesSaveData {
    dummy: DummyMiniGameSaveData;
    marketing: MarketingMiniGameSaveData;

    constructor(dummy: DummyMiniGameSaveData, marketing: MarketingMiniGameSaveData) {
        this.dummy = dummy;
        this.marketing = marketing;
    }
}
