import {SingleLevelUpgrade} from "../upgrades/SingleLevelUpgrade";
import {SkillTreeRequirement} from "./SkillTreeRequirement";
import {MiniGameUpgradeType} from "../../features/minigames/MiniGameUpgradeType";
import {Currency} from "../../features/wallet/Currency";
import {App} from "../../App";

export class SkillTreeUpgrade {
    upgrade: SingleLevelUpgrade;
    requirements: SkillTreeRequirement[];

    type: MiniGameUpgradeType;

    constructor(type: MiniGameUpgradeType, upgrade: SingleLevelUpgrade, requirements: SkillTreeRequirement[] = []) {
        this.type = type;
        this.upgrade = upgrade;
        this.requirements = requirements;
    }

    canBuy(): boolean {
        for (const requirement of this.requirements) {
            if (!requirement.isCompleted()) {
                return false;
            }
        }
        return this.upgrade.canBuy();
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
