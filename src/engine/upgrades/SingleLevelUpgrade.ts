import {DiscreteUpgrade} from "./DiscreteUpgrade";
import {Currency} from "../../features/wallet/Currency";
import {App} from "../../App";
import {MiniGameUpgradeType} from "../../features/minigames/MiniGameUpgradeType";

/**
 * An upgrade with a max level of 1
 */
export class SingleLevelUpgrade extends DiscreteUpgrade {

    isPrestige: boolean;

    constructor(identifier: string, displayName: string, cost: Currency, bonus: number, isPrestige: boolean = false) {
        super(identifier, displayName, 1, [cost], [0, bonus], true);
        this.isPrestige = isPrestige
    }

    isBought(): boolean {
        return this.isMaxLevel();
    }

    // Ugly hack to make it work
    getCost(): Currency {
        if (this.isPrestige) {
            const oldCost = super.getCost();
            const newAmount = App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.PrestigeUpgradeCost) * oldCost.amount;
            return new Currency(newAmount, oldCost.type);
        } else {
            return super.getCost();
        }
    }
}
