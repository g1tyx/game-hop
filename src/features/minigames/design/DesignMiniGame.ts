import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {DesignMiniGameSaveData} from "./DesignMiniGameSaveData";
import {DesignShapesRequirement} from "./DesignShapesRequirement";
import {DesignShape} from "./DesignShape";
import {EnumHelper} from "../../../engine/util/EnumHelper";
import {DesignColorType} from "./DesignColorType";
import {DesignShapeType} from "./DesignShapeType";
import {ObservableArrayProxy} from "../../../engine/knockout/ObservableArrayProxy";
import {Currency} from "../../wallet/Currency";
import {CurrencyType} from "../../wallet/CurrencyType";
import {MiniGameUpgradeType} from "../MiniGameUpgradeType";
import {App} from "../../../App";
import {DesignUpgrade} from "./DesignUpgrade";


export class DesignMiniGame extends MiniGame {
    name: string = "Design";
    saveKey: string = "design";

    private readonly _shapesCorrect: ko.Observable<number>;

    private readonly _targetShape: ko.Observable<DesignShape>;
    private readonly shapeOptions: ObservableArrayProxy<DesignShape>;


    constructor(budgetRequirement: number) {
        super(budgetRequirement);
        this._shapesCorrect = ko.observable(0);
        this.yearRequirements = [];

        this._targetShape = ko.observable();
        this.shapeOptions = new ObservableArrayProxy<DesignShape>([]);

    }

    initialize(): void {
        this.yearRequirements.push(new DesignShapesRequirement("Design - Recognize shapes", 100, 100))

        this.upgrades.push(new DesignUpgrade("design-value-1", "Designs are worth 50% more", new Currency(100, CurrencyType.money), 1.50, MiniGameUpgradeType.DesignShapeValue))
        this.upgrades.push(new DesignUpgrade("design-value-2", "Designs are worth 50% more", new Currency(200, CurrencyType.money), 1.50, MiniGameUpgradeType.DesignShapeValue))
        this.upgrades.push(new DesignUpgrade("design-reduce-wrong-penalty-1", "Lose one less design on wrong answer", new Currency(50, CurrencyType.money), 1, MiniGameUpgradeType.DesignReduceWrongPenalty))
        this.upgrades.push(new DesignUpgrade("design-reduce-wrong-penalty-2", "Lose one less design on wrong answer", new Currency(75, CurrencyType.money), 1, MiniGameUpgradeType.DesignReduceWrongPenalty))
        this.upgrades.push(new DesignUpgrade("design-reduce-options-1", "Reduce possible options by one", new Currency(75, CurrencyType.money), 1, MiniGameUpgradeType.DesignReduceOptions))
        this.upgrades.push(new DesignUpgrade("design-reduce-options-2", "Reduce possible options by one", new Currency(100, CurrencyType.money), 1, MiniGameUpgradeType.DesignReduceOptions))

        this.generateNewPuzzle()
    }

    guess(designShape: DesignShape): boolean {
        const correct = designShape.color == this.targetShape.color && designShape.shape == this.targetShape.shape;

        if (correct) {
            this.shapesCorrect += this.getCorrectValue();
        } else {
            this.shapesCorrect = Math.max(0, this.shapesCorrect - this.getWrongPenalty());
        }

        this.generateNewPuzzle();

        return correct;
    }

    getCorrectValue(): number {
        return this.getTotalMultiplierForType(MiniGameUpgradeType.DesignShapeValue) * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.DesignShapeValue);
    }

    getWrongPenalty(): number {
        return Math.max(0, 3 - this.getBoughtUpgradesOfType(MiniGameUpgradeType.DesignReduceWrongPenalty).length - App.game.prestige.skillTree.getBoughtUpgradesOfType(MiniGameUpgradeType.DesignReduceWrongPenalty).length);
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
        return Math.max(1, 4 - this.getBoughtUpgradesOfType(MiniGameUpgradeType.DesignReduceOptions).length) -  App.game.prestige.skillTree.getBoughtUpgradesOfType(MiniGameUpgradeType.DesignReduceOptions).length;
    }

    private generateRandomShape(): DesignShape {
        const shape: DesignShapeType = EnumHelper.randomValue(DesignShapeType);
        const color: DesignColorType = EnumHelper.randomValue(DesignColorType);
        return new DesignShape(shape, color);
    }

    load(data: DesignMiniGameSaveData): void {
        this.shapesCorrect = data.correct;
        this.loadUpgrades(data.upgrades)
    }

    parseSaveData(json: Record<string, unknown>): DesignMiniGameSaveData {
        return new DesignMiniGameSaveData(json?.correct as number ?? 0, this.parseUpgradeSaveData(json?.upgrades as Record<string, unknown>))
    }

    reset(): void {
        this.shapesCorrect = 0;
    }

    save(): DesignMiniGameSaveData {
        return new DesignMiniGameSaveData(this.shapesCorrect, this.saveUpgrades());
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
