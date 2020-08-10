import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {DesignMiniGameSaveData} from "./DesignMiniGameSaveData";
import {DesignShapesRequirement} from "./DesignShapesRequirement";
import {DesignShape} from "./DesignShape";
import {ArrayOfObservables} from "../../../engine/knockout/ArrayOfObservables";


export class DesignMiniGame extends MiniGame {
    name: string = "Design";
    saveKey: string = "design";

    private readonly _shapesCorrect: ko.Observable<number>;

    private readonly _targetShape: ko.Observable<DesignShape>;
    private readonly _shapeOptions: ArrayOfObservables<DesignShape>;

    constructor() {
        super();
        this._shapesCorrect = ko.observable(0);
        this.yearRequirements = [];

        this._targetShape = ko.observable();
        this._shapeOptions = new ArrayOfObservables<DesignShape>([]);
    }

    generateNewPuzzle(): void {
        this
    }

    initialize(): void {
        this.yearRequirements.push(new DesignShapesRequirement("Create designs", 100, 400))
    }

    load(data: DesignMiniGameSaveData): void {
    }

    parseSaveData(json: Record<string, unknown>): DesignMiniGameSaveData {
        return undefined;
    }

    reset(): void {
        this.shapesCorrect = 0;
    }

    save(): DesignMiniGameSaveData {
        return undefined;
    }

    // Knockout getters/setters
    get shapesCorrect(): number {
        return this._shapesCorrect();
    }

    set shapesCorrect(value: number) {
        this._shapesCorrect(value);
    }
}
