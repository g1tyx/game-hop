import {MiniGame} from "../MiniGame";
import {Feature} from "../../../engine/Feature";
import {Requirement} from "../../../engine/requirements/Requirement";
import {SaveData} from "../../../engine/saving/SaveData";
import * as ko from "knockout";
import {DummyClickRequirement} from "./DummyClickRequirement";
import {DummyMiniGameSaveData} from "./DummyMiniGameSaveData";

export class DummyMiniGame extends Feature implements MiniGame {
    name: string = "Dummy MiniGame";
    saveKey: string = "dummy";
    yearRequirements: Requirement[];

    _clicks: ko.Observable<number>;


    constructor() {
        super();
        this._clicks = ko.observable(0);
        this.yearRequirements = [];
    }

    initialize(): void {
        this.yearRequirements.push(new DummyClickRequirement(100))
    }

    reset(): void {
    }


    load(data: DummyMiniGameSaveData): void {
        this.clicks = data.clicks;
    }

    parseSaveData(json: Record<string, unknown>): DummyMiniGameSaveData {
        return new DummyMiniGameSaveData(json?.clicks as number ?? 0);
    }

    save(): SaveData {
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
