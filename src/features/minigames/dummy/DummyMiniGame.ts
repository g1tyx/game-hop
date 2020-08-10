import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {DummyClickRequirement} from "./DummyClickRequirement";
import {DummyMiniGameSaveData} from "./DummyMiniGameSaveData";

export class DummyMiniGame extends MiniGame {
    name: string = "Dummy MiniGame";
    saveKey: string = "dummy";

    _clicks: ko.Observable<number>;


    constructor() {
        super();
        this._clicks = ko.observable(0);
    }

    initialize(): void {
        this.yearRequirements.push(new DummyClickRequirement("Clicks", 100, 100))
    }

    click(): void {
        this.clicks++;
    }

    reset(): void {
        this.clicks = 0;
    }


    load(data: DummyMiniGameSaveData): void {
        this.clicks = data.clicks;
    }

    parseSaveData(json: Record<string, unknown>): DummyMiniGameSaveData {
        return new DummyMiniGameSaveData(json?.clicks as number ?? 0);
    }

    save(): DummyMiniGameSaveData {
        return new DummyMiniGameSaveData(this.clicks);
    }

    // Knockout getters/setters
    get clicks(): number {
        return this._clicks();
    }

    set clicks(value: number) {
        this._clicks(value);
    }


}
