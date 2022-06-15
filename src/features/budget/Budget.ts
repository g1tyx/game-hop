import * as ko from "knockout";

import {Feature} from "../../engine/Feature";
import {BudgetSaveData} from "./BudgetSaveData";
import {App} from "../../App";
import {ISignal, SignalDispatcher} from "ste-signals";
import * as $ from "jquery";

export class Budget extends Feature {
    name: string = "Budget";
    saveKey: string = "budget";

    _yearlyBudget: ko.Observable<number>;

    readonly BUDGET_TRIGGER_AMOUNT: number = 0;

    private _onBudgetIsGone = new SignalDispatcher();

    constructor() {
        super();
        this._yearlyBudget = ko.observable(1000);
    }

    initialize(): void {
        App.game.yearTracker.onMonthStart.subscribe(() => this.gainMoney());
    }

    getPrestigeMultiplier(): number {
        return 1 + Math.pow(1000-this.yearlyBudget, 1/1.25)/125.594321575
    }

    shrinkBudget(amount: number): void {
        if (this.yearlyBudget <= this.BUDGET_TRIGGER_AMOUNT) {
            this._onBudgetIsGone.dispatch();
        }
        this.yearlyBudget = Math.max(0, this.yearlyBudget - amount);
    }

    gainMoney(): void {
        App.game.wallet.gainMoney(this.yearlyBudget / 12);
    }


    // Saving logic
    load(data: BudgetSaveData): void {
        this.yearlyBudget = data.budget;
    }

    parseSaveData(json: Record<string, unknown>): BudgetSaveData {
        return new BudgetSaveData(json?.budget as number ?? 1000);
    }

    save(): BudgetSaveData {
        return new BudgetSaveData(this.yearlyBudget);
    }

    // Event getters/setters
    public get onBudgetIsGone(): ISignal {
        return this._onBudgetIsGone.asEvent();
    }

    // Knockout getters/setters
    get yearlyBudget(): number {
        return this._yearlyBudget();
    }

    set yearlyBudget(value: number) {
        this._yearlyBudget(value);
    }
}
