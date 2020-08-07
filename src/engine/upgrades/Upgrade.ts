import {Saveable} from "../saving/Saveable";
import * as ko from "knockout";
import {Currency} from "../../features/wallet/Currency";
import {App} from "../../App";
import {UpgradeSaveData} from "./UpgradeSaveData";
import {CurrencyType} from "../../features/wallet/CurrencyType";

/**
 * Generic upgrade class
 */
export abstract class Upgrade implements Saveable {
    identifier: string;
    displayName: string;
    maxLevel: number;
    _level: ko.Observable<number> = ko.observable();

    // Describes whether this upgrade increases or decreases a number.
    // (e.g. power is increasing, time is decreasing).
    increasing: boolean;


    protected constructor(identifier: string, displayName: string, maxLevel: number, increasing = true) {
        this.identifier = identifier;
        this.displayName = displayName;
        this.maxLevel = maxLevel;
        this.level = 0;
        this.increasing = increasing;
    }

    abstract getCost(): Currency;

    abstract getBonus(level: number): number;

    getUpgradeBonus(): number {
        if (!this.isMaxLevel()) {
            return this.getBonus(this.level + 1) - this.getBonus(this.level);
        }
        return 0;
    }

    isMaxLevel(): boolean {
        return this.level >= this.maxLevel;
    }

    canAfford(): boolean {
        return App.game.wallet.hasCurrency(this.getCost());
    }

    // Override in subclass when other requirements exist.
    canBuy(): boolean {
        return this.level < this.maxLevel && this.canAfford();
    }

    buy(): void {
        if (this.canBuy()) {
            App.game.wallet.loseCurrency(this.getCost());
            this.levelUp();
        }
    }

    levelUp(): void {
        this.level = this.level + 1;
    }

    // Knockout getters/setters
    get level(): number {
        return this._level();
    }

    set level(value) {
        this._level(Math.min(value, this.maxLevel));
    }

    // Save logic
    saveKey: string = this.identifier;

    load(data: UpgradeSaveData): void {
        this.level = data.level;
    }

    parseSaveData(json: Record<string, unknown>): UpgradeSaveData {
        return new UpgradeSaveData(json?.level as number ?? 0)
    }

    save(): UpgradeSaveData {
        return new UpgradeSaveData(this.level)
    }

}
