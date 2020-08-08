import {SingleLevelUpgrade} from "../upgrades/SingleLevelUpgrade";
import {SkillTreeRequirement} from "./SkillTreeRequirement";

export class SkillTreeUpgrade {
    upgrade: SingleLevelUpgrade;
    requirements: SkillTreeRequirement[];

    constructor(upgrade: SingleLevelUpgrade, requirements: SkillTreeRequirement[] = []) {
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

    buy(): void {
        if (this.canBuy()) {
            this.upgrade.buy();
        }
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
