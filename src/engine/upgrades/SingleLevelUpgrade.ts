import {DiscreteUpgrade} from "./DiscreteUpgrade";
import {Currency} from "../../features/wallet/Currency";

/**
 * An upgrade with a max level of 1
 */
export class SingleLevelUpgrade extends DiscreteUpgrade {

    constructor(identifier: string, displayName: string, cost: Currency, bonus: number) {
        super(identifier, displayName, 1, [cost], [0, bonus], true);
    }

    isBought(): boolean {
        return this.isMaxLevel();
    }
}
