import {SkillTreeUpgrade} from "./SkillTreeUpgrade";
import {Saveable} from "../saving/Saveable";
import {SkillTreeSaveData} from "./SkillTreeSaveData";
import {MiniGameUpgradeType} from "../../features/minigames/MiniGameUpgradeType";

export class SkillTree implements Saveable {
    upgrades: SkillTreeUpgrade[];

    constructor(upgrades: SkillTreeUpgrade[]) {
        this.upgrades = upgrades;
    }

    addUpgrade(upgrade: SkillTreeUpgrade): void {
        this.upgrades.push(upgrade)
    }

    getUpgrade(key: string): SkillTreeUpgrade {
        for (const upgrade of this.upgrades) {
            if (upgrade.identifier === key) {
                return upgrade;
            }
        }
        return null;
    }

    getBoughtUpgradesOfType(type: MiniGameUpgradeType): SkillTreeUpgrade[] {
        return this.upgrades.filter(upgrade => upgrade.isBought() && upgrade.type == type);
    }

    getTotalMultiplierForType(type: MiniGameUpgradeType): number {
        let multiplier = 1;
        const boughtUpgradesOfType = this.getBoughtUpgradesOfType(type);
        for (const upgrade of boughtUpgradesOfType) {
            multiplier *= upgrade.getBonus();
        }
        return multiplier;
    }

    saveKey: string = 'skill-tree'

    load(data: SkillTreeSaveData): void {
        for (const key of data.upgradeKeys) {
            const upgrade = this.getUpgrade(key);
            if (key == null) {
                console.warn(`Could not load upgrade ${key}`);
            } else {
                upgrade.level = 1;
            }
        }
    }

    parseSaveData(json: Record<string, unknown>): SkillTreeSaveData {
        const data = new SkillTreeSaveData();
        const list = json?.upgradeKeys as string[];
        if (list == null) {
            return data;
        }
        for (const key of list) {
            data.addUpgrade(key);
        }
        return data;
    }

    save(): SkillTreeSaveData {
        const data = new SkillTreeSaveData();
        for (const upgrade of this.upgrades) {
            if (upgrade.isBought()) {
                data.addUpgrade(upgrade.identifier);
            }
        }
        return data;
    }
}
