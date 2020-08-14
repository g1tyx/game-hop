import {MiniGameUpgrade} from "../MiniGameUpgrade";
import {App} from "../../../App";
import {MiniGameUpgradeType} from "../MiniGameUpgradeType";
import {Currency} from "../../wallet/Currency";

export class DesignUpgrade extends MiniGameUpgrade {

    getCost(): Currency {
        const oldCost = super.getCost();
        const newAmount = App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.DesignUpgradeCost) * oldCost.amount;
        return new Currency(newAmount, oldCost.type);
    }
}
