import * as ko from "knockout";
import {Currency} from "../../wallet/Currency";
import {App} from "../../../App";

export class MarketingCampaign {
    public description: string;

    public readonly _baseMonthsToComplete: number;
    public readonly _baseCost: Currency;
    public readonly _baseFameReward: number;

    private readonly _completionProgress: ko.Observable<number>;
    private readonly _isStarted: ko.Observable<boolean>;

    constructor(description: string, monthsToComplete: number, cost: Currency, fameReward: number) {
        this.description = description;
        this._baseMonthsToComplete = monthsToComplete;
        this._baseCost = cost;
        this._baseFameReward = fameReward;

        this._completionProgress = ko.observable(0);
        this._isStarted = ko.observable(false);
    }

    public tryToStart(): boolean {
        if (this.isStarted) {
            return false;
        }
        if (!App.game.wallet.hasCurrency(this.cost)) {
            return false;
        }

        App.game.wallet.loseCurrency(this.cost);
        this.start();
        return true;
    }

    public cancel(): void {
        App.game.miniGames.marketing.removeCampaign(this);
    }

    public getProgressPercentage(): number {
        return this.completionProgress / this.monthsToComplete;
    }

    public isCompleted(): boolean {
        return this.completionProgress >= this.monthsToComplete;
    }

    private start(): void {
        this.isStarted = true;
    }

    // Knockout getters/setters
    get completionProgress(): number {
        return this._completionProgress();
    }

    set completionProgress(value: number) {
        this._completionProgress(value);
    }

    get isStarted(): boolean {
        return this._isStarted();
    }

    set isStarted(value: boolean) {
        this._isStarted(value);
    }


    get fameReward(): number {
        return this._baseFameReward * App.game.miniGames.marketing.getFameGainMultiplier();
    }

    get cost(): Currency {
        return new Currency(this._baseCost.amount * App.game.miniGames.marketing.getCostMultiplier(), this._baseCost.type);
    }

    get monthsToComplete(): number {
        return this._baseMonthsToComplete * App.game.miniGames.marketing.getSpeedMultiplier();
    }

}
