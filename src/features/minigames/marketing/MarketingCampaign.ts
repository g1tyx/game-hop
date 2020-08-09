import * as ko from "knockout";
import {Currency} from "../../wallet/Currency";
import {App} from "../../../App";

export class MarketingCampaign {
    public description: string;

    public monthsToComplete: number;
    public cost: Currency;
    public fameReward: number;

    private readonly _completionProgress: ko.Observable<number>;
    private readonly _isStarted: ko.Observable<boolean>;

    constructor(description: string, monthsToComplete: number, cost: Currency, fameReward: number) {
        this.description = description;
        this.monthsToComplete = monthsToComplete;
        this.cost = cost;
        this.fameReward = fameReward;

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

}
