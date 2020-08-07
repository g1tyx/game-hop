import {Upgrade} from "./Upgrade";
import {Currency} from "../../features/wallet/Currency";
import {CurrencyType} from "../../features/wallet/CurrencyType";

export class DiscreteUpgrade extends Upgrade {

    costList: Currency[] = [];
    bonusList: number[] = []

    constructor(identifier: string, displayName: string, maxLevel: number, costList: Currency[], bonusList: number[], increasing: boolean) {
        super(identifier, displayName, maxLevel, increasing);
        this.costList = costList;
        this.bonusList = bonusList;
    }

    getCost(): Currency {
        if (this.isMaxLevel()) {
            return new Currency(Infinity, CurrencyType.money);
        }
        return this.costList[this.level];
    }

    // Override with a custom function
    getBonus(level: number = this.level): number {
        return this.bonusList[level];
    }

}
