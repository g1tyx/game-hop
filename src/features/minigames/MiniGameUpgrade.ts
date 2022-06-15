import {App} from "../../App";
import {SingleLevelUpgrade} from "../../engine/upgrades/SingleLevelUpgrade";
import {MiniGameUpgradeType} from "./MiniGameUpgradeType";
import {Currency} from "../wallet/Currency";

export class MiniGameUpgrade extends SingleLevelUpgrade {
    type: MiniGameUpgradeType;


    constructor(identifier: string, displayName: string, cost: Currency, bonus: number, type: MiniGameUpgradeType) {
        super(identifier, displayName, cost, bonus);
        this.type = type;
    }

    getCost(): Currency {
        const superCost = super.getCost();
        return new Currency(superCost.amount * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.MiniGameUpgradeCost), superCost.type)
    }
}
