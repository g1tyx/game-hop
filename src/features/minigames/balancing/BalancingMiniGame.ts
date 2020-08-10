import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {BalancingFocusRequirement} from "./BalancingFocusRequirement";

class BalancingMiniGameSaveData {
}

export class BalancingMiniGame extends MiniGame {
    name: string = "Balancing";
    saveKey: string = "balancing";

    private _focus: ko.Observable<number>;

    private readonly _actualCursor: ko.Observable<number>;
    private readonly _targetCursor: ko.Observable<number>;

    resetTicks: number = 50;
    currentTicks: number = 0;

    movementSpeed: number = 0.1;

    constructor() {
        super();
        this._focus = ko.observable(0);
        this.yearRequirements = [];
        this._actualCursor = ko.observable(0.50);
        this._targetCursor = ko.observable(0);
    }

    moveLeft(): void {
        this.actualCursor = Math.max(0, this.actualCursor - this.movementSpeed);
    }

    moveRight(): void {
        this.actualCursor = Math.min(1, this.actualCursor + this.movementSpeed);
    }

    update(delta: number): void {
        this.currentTicks++;

        const error = Math.abs(this.targetCursor - this.actualCursor);

        const focusGain = 1 - 3 * error;
        if (focusGain > 0) {
            this.focus += focusGain * delta * 20;
        }

        if (this.currentTicks >= this.resetTicks) {
            this.currentTicks = 0;
            this.randomizeTarget();
        }
    }

    randomizeTarget(): void {
        this.targetCursor = Math.random();
    }

    initialize(): void {
        this.yearRequirements.push(new BalancingFocusRequirement("Gain focus", 1000))

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
