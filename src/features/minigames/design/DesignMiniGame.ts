import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {DesignMiniGameSaveData} from "./DesignMiniGameSaveData";
import {DesignShapesRequirement} from "./DesignShapesRequirement";
import {DesignShape} from "./DesignShape";
import {EnumHelper} from "../../../engine/util/EnumHelper";
import {DesignColorType} from "./DesignColorType";
import {DesignShapeType} from "./DesignShapeType";
import {ObservableArrayProxy} from "../../../engine/knockout/ObservableArrayProxy";


export class DesignMiniGame extends MiniGame {
    name: string = "Design";
    saveKey: string = "design";

    private readonly _shapesCorrect: ko.Observable<number>;

    private readonly _targetShape: ko.Observable<DesignShape>;
    private readonly shapeOptions: ObservableArrayProxy<DesignShape>;


    constructor() {
        super();
        this._shapesCorrect = ko.observable(0);
        this.yearRequirements = [];

        this._targetShape = ko.observable();
        this.shapeOptions = new ObservableArrayProxy<DesignShape>([]);

    }

    initialize(): void {
        this.yearRequirements.push(new DesignShapesRequirement("Create designs", 100, 400))

        this.generateNewPuzzle()
    }

    guess(designShape: DesignShape): boolean {
        const correct = designShape.color == this.targetShape.color && designShape.shape == this.targetShape.shape;

        if (correct) {
            this.shapesCorrect++;
        } else {
            this.shapesCorrect = Math.max(0, this.shapesCorrect - 1);
        }

        this.generateNewPuzzle();

        return correct;
    }

    generateNewPuzzle(): void {
        while (this.shapeOptions.length > 0) {
            this.shapeOptions.pop();
        }

        this.targetShape = this.generateRandomShape();


        // A bit ugly randomization, couldn't figure out how to shuffle the array proxy
        const randIndex = Math.floor(Math.random() * this.getOptionCount());
        for (let i = 0; i < this.getOptionCount(); i++) {
            if (i == randIndex) {
                this.shapeOptions.push(this.targetShape);
            } else {
                this.shapeOptions.push(this.generateRandomShape());

            }
        }
    }

    private getOptionCount(): number {
        return 4;
    }

    private generateRandomShape(): DesignShape {
        const shape: DesignShapeType = EnumHelper.randomValue(DesignShapeType);
        const color: DesignColorType = EnumHelper.randomValue(DesignColorType);
        return new DesignShape(shape, color);
    }

    load(data: DesignMiniGameSaveData): void {
        this.shapesCorrect = data.correct;
    }

    parseSaveData(json: Record<string, unknown>): DesignMiniGameSaveData {
        return new DesignMiniGameSaveData(json?.correct as number ?? 0)
    }

    reset(): void {
        this.shapesCorrect = 0;
    }

    save(): DesignMiniGameSaveData {
        return new DesignMiniGameSaveData(this.shapesCorrect)
    }

    // Knockout getters/setters
    get shapesCorrect(): number {
        return this._shapesCorrect();
    }

    set shapesCorrect(value: number) {
        this._shapesCorrect(value);
    }

    get targetShape(): DesignShape {
        return this._targetShape();
    }

    set targetShape(value: DesignShape) {
        this._targetShape(value);
    }
}
