import {MiniGame} from "../MiniGame";
import * as ko from "knockout";

class BalancingMiniGameSaveData {
}

export class BalancingMiniGame extends MiniGame {
    name: string = "Balancing";
    saveKey: string = "balancing";

    private _focus: ko.Observable<number>;


    constructor() {
        super();
        this._focus = ko.observable(0);
        this.yearRequirements = [];
    }

    initialize(): void {
    }

    load(data: BalancingMiniGameSaveData): void {
    }

    parseSaveData(json: Record<string, unknown>): BalancingMiniGameSaveData {
        return undefined;
    }

    reset(): void {
    }

    save(): BalancingMiniGameSaveData {
        return undefined;
    }

    // Knockout getters/setters
    get focus(): number {
        return this._focus();
    }

    set focus(value: number) {
        this._focus(value);
    }

}
