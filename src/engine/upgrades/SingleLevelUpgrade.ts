import {DiscreteUpgrade} from "./DiscreteUpgrade";
import {Currency} from "../../features/wallet/Currency";

/**
 * An upgrade with a max level of 1
 */
export class singleLevelUpgrade extends DiscreteUpgrade {

    constructor(identifier: string, displayName: string, maxLevel: number, cost: Currency, bonus: number) {
        super(identifier, displayName, 1, [cost], [bonus], true);
    }
}
