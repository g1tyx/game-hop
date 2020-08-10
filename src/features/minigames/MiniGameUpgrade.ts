import {SingleLevelUpgrade} from "../../engine/upgrades/SingleLevelUpgrade";
import {MiniGameUpgradeType} from "./MiniGameUpgradeType";
import {Currency} from "../wallet/Currency";

export class MiniGameUpgrade extends SingleLevelUpgrade {
    type: MiniGameUpgradeType;


    constructor(identifier: string, displayName: string, cost: Currency, bonus: number, type: MiniGameUpgradeType) {
        super(identifier, displayName, cost, bonus);
        this.type = type;
    }
}
