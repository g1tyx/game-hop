import {SingleLevelUpgrade} from "../upgrades/SingleLevelUpgrade";
import {SkillTreeRequirement} from "./SkillTreeRequirement";
import {MiniGameUpgradeType} from "../../features/minigames/MiniGameUpgradeType";
import {Currency} from "../../features/wallet/Currency";
import {App} from "../../App";

export class SkillTreeUpgrade {
    upgrade: SingleLevelUpgrade;
    requirements: SkillTreeRequirement[];

    type: MiniGameUpgradeType;
    shortHand: string;

    constructor(shortHand: string, type: MiniGameUpgradeType, upgrade: SingleLevelUpgrade, requirements: SkillTreeRequirement[] = []) {
        this.shortHand = shortHand;
        this.type = type;
        this.upgrade = upgrade;
        this.upgrade.isPrestige = true;
        this.requirements = requirements;
    }

    canBuy(): boolean {
        return this.requirementsCompleted() && this.upgrade.canBuy();
    }

    requirementsCompleted(): boolean {
        for (const requirement of this.requirements) {
            if (!requirement.isCompleted()) {
                return false;
            }
        }
        return true;
    }

    getRequirementsString(): string {
        let res = "";
        for (const req of this.requirements) {
            res += App.game.prestige.skillTree.getUpgrade(req.upgradeKey).getDisplayName();
        }
        return res;
    }

    getDisplayName(): string {
        return this.upgrade.displayName;
    }

    buy(): boolean {
        if (this.canBuy()) {
            this.upgrade.buy();
            return true;
        }
        return false
    }

    getShortCostString(): string {
        if (this.isBought()) {
            return ""
        } else {
            return `(${this.getCost().amount})`
        }
    }

    getLongCostString(): string {
        if (this.isBought()) {
            return "(Bought)"
        } else {
            return `(${this.getCost().amount} prestige points)`
        }
    }

    getCost(): Currency {
        return this.upgrade.getCost()
    }

    getBonus(): number {
        return this.upgrade.getBonus();
    }

    isBought(): boolean {
        return this.upgrade.isBought();
    }

    get level(): number {
        return this.upgrade.level;
    }

    set level(value: number) {
        this.upgrade.level = value;
    }

    get identifier(): string {
        return this.upgrade.identifier;
    }
}
