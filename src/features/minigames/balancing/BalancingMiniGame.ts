import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {BalancingFocusRequirement} from "./BalancingFocusRequirement";
import {BalancingMiniGameSaveData} from "./BalancingMiniGameSaveData";
import {MiniGameUpgradeType} from "../MiniGameUpgradeType";
import {App} from "../../../App";
import {Currency} from "../../wallet/Currency";
import {CurrencyType} from "../../wallet/CurrencyType";
import {BalancingUpgrade} from "./BalancingUpgrade";


export class BalancingMiniGame extends MiniGame {
    name: string = "Balancing";
    saveKey: string = "balancing";

    private _focus: ko.Observable<number>;

    private readonly _actualCursor: ko.Observable<number>;
    private readonly _targetCursor: ko.Observable<number>;

    currentMonthTime: number = 0;

    movingLeft: boolean = false;
    movingRight: boolean = false;

    movementSpeed: number = 0.1;

    constructor(budgetRequirement: number) {
        super(budgetRequirement);
        this._focus = ko.observable(0);
        this.yearRequirements = [];
        this._actualCursor = ko.observable(0.50);
        this._targetCursor = ko.observable(0);
    }

    moveLeft(): void {
        this.movingLeft = true;
        this.movingRight = false;
    }

    stopMovement(): void {
        this.movingLeft = false;
        this.movingRight = false;
    }

    moveRight(): void {
        this.movingLeft = false;
        this.movingRight = true;
    }

    update(delta: number): void {
        const monthDelta: number = App.game.yearTracker.secondsToMonthPercentage(delta);
        this.currentMonthTime += monthDelta;

        if (this.movingLeft) {
            this.actualCursor = Math.max(0, this.actualCursor - this.getMovementSpeed() * monthDelta);
        } else if (this.movingRight) {
            this.actualCursor = Math.min(1, this.actualCursor + this.getMovementSpeed() * monthDelta);
        }

        const error = Math.abs(this.targetCursor - this.actualCursor);

        const focusGain = 1 - 8 * error;
        if (focusGain > 0) {
            this.focus += monthDelta * focusGain * this.getFocusMultiplier();
        }

        if (this.currentMonthTime >= this.getMoveTime()) {
            this.currentMonthTime = 0;
            this.randomizeTarget();
        }
    }

    randomizeTarget(): void {
        this.targetCursor = Math.random();
    }

    getMovementSpeed(): number {
        return 2 * this.getTotalMultiplierForType(MiniGameUpgradeType.BalancingMovementSpeed) * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.BalancingMovementSpeed);
    }

    getFocusMultiplier(): number {
        return 50 * this.getTotalMultiplierForType(MiniGameUpgradeType.BalancingFocusGain) * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.BalancingFocusGain);
    }

    // In months
    getMoveTime(): number {
        return 0.5 * this.getTotalMultiplierForType(MiniGameUpgradeType.BalancingTargetMovement) * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.BalancingTargetMovement);
    }

    initialize(): void {
        this.yearRequirements.push(new BalancingFocusRequirement("Development - Stay focused", 1000, 100))

        this.upgrades.push(new BalancingUpgrade('balancing-movement-speed-1', "Improve your movement speed by 100%", new Currency(100, CurrencyType.money), 2.00, MiniGameUpgradeType.BalancingMovementSpeed));
        this.upgrades.push(new BalancingUpgrade('balancing-focus-1', "Improve focus gain 50%", new Currency(100, CurrencyType.money), 1.50, MiniGameUpgradeType.BalancingFocusGain));
        this.upgrades.push(new BalancingUpgrade('balancing-focus-2', "Improve focus gain 50%", new Currency(150, CurrencyType.money), 1.50, MiniGameUpgradeType.BalancingFocusGain));
        this.upgrades.push(new BalancingUpgrade('balancing-target-movement-1', "Remove target movement by 25%", new Currency(50, CurrencyType.money), 1.25, MiniGameUpgradeType.BalancingTargetMovement));
        this.upgrades.push(new BalancingUpgrade('balancing-target-movement-2', "Remove target movement by 25%", new Currency(75, CurrencyType.money), 1.25, MiniGameUpgradeType.BalancingTargetMovement));

        this.randomizeTarget();
    }

    load(data: BalancingMiniGameSaveData): void {
    }

    parseSaveData(json: Record<string, unknown>): BalancingMiniGameSaveData {
        return undefined;
    }

    reset(): void {
        this.focus = 0;
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

    get actualCursor(): number {
        return this._actualCursor();
    }

    set actualCursor(value: number) {
        this._actualCursor(value);
    }

    get targetCursor(): number {
        return this._targetCursor();
    }

    set targetCursor(value: number) {
        this._targetCursor(value);
    }
}
