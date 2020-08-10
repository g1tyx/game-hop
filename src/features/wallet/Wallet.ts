import {Feature} from "../../engine/Feature";
import {ArrayOfObservables} from "../../engine/knockout/ArrayOfObservables";
import {App} from "../../App";
import {Currency} from "./Currency";
import {CurrencyType} from "./CurrencyType";
import {WalletSaveData} from "./WalletSaveData";
import {ISimpleEvent, SimpleEventDispatcher} from "ste-simple-events";

export class Wallet extends Feature {
    name = 'Wallet';
    currencies: ArrayOfObservables<number>;

    private _onMoneyGain = new SimpleEventDispatcher<number>();
    private _onPrestigeGain = new SimpleEventDispatcher<number>();

    constructor() {
        super();
        this.currencies = new ArrayOfObservables([0, 0]);
    }

    public resetMoney(): void {
        this.currencies[CurrencyType.money] = 0;
    }

    public gainMoney(base: number): number {
        const money = base * App.game.getTotalMoneyMultiplier();

        this._onMoneyGain.dispatch(money);
        this.addCurrency(new Currency(money, CurrencyType.money));
        return money;
    }


    public gainPrestige(base: number): number {
        this._onPrestigeGain.dispatch(base);
        this.addCurrency(new Currency(base, CurrencyType.prestige));
        return base;
    }

    private addCurrency(currency: Currency) {
        if (isNaN(currency.amount) || currency.amount <= 0) {
            console.trace(`Could not add currency ${currency.toString()}`);
            return;
        }

        this.currencies[currency.type] += currency.amount;
    }

    public hasCurrency(currency: Currency): boolean {
        return this.currencies[currency.type] >= currency.amount;
    }

    public loseCurrency(currency: Currency): void {
        if (isNaN(currency.amount) || currency.amount <= 0) {
            console.trace(`Could not lose currency ${currency.toString()}`);
            return;
        }

        this.currencies[currency.type] -= currency.amount;
    }

    // Saving logic
    saveKey = "wallet";

    load(data: WalletSaveData): void {
        this.currencies = new ArrayOfObservables([data.money, data.prestige]);
    }

    save(): WalletSaveData {
        return new WalletSaveData(this.currencies[CurrencyType.money], this.currencies[CurrencyType.prestige])
    }

    parseSaveData(json: Record<string, unknown>): WalletSaveData {
        const money = json[CurrencyType[CurrencyType.money]] as number ?? 0;
        const prestige = json[CurrencyType[CurrencyType.prestige]] as number ?? 0;
        return new WalletSaveData(money, prestige);
    }

    initialize(): void {
    }

    canAccess(): boolean {
        return true;
    }

    public get onMoneyGain(): ISimpleEvent<number> {
        return this._onMoneyGain.asEvent();
    }

    public get onPrestigeGain(): ISimpleEvent<number> {
        return this._onPrestigeGain.asEvent();
    }


}
