import {DummyMiniGameSaveData} from "./dummy/DummyMiniGameSaveData";

export class MiniGamesSaveData {
    dummy: DummyMiniGameSaveData;

    constructor(dummy: DummyMiniGameSaveData) {
        this.dummy = dummy;
    }
}
