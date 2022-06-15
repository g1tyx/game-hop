import {Feature} from "../../engine/Feature";
import {MiniGameRequirement} from "./MiniGameRequirement";
import {ObservableArrayProxy} from "../../engine/knockout/ObservableArrayProxy";
import {MiniGameUpgradeType} from "./MiniGameUpgradeType";
import {MiniGameUpgrade} from "./MiniGameUpgrade";
import {App} from "../../App";
import {UpgradeListSaveData} from "../../engine/upgrades/UpgradeListSaveData";

export abstract class MiniGame extends Feature {
    abstract reset(): void

    upgrades: ObservableArrayProxy<MiniGameUpgrade>;
    yearRequirements: MiniGameRequirement[];

    budgetRequirement: number;

    protected constructor(budgetRequirement: number) {
        super();
        this.budgetRequirement = budgetRequirement;
        this.yearRequirements = [];
        this.upgrades = new ObservableArrayProxy<MiniGameUpgrade>([]);
    }

    canAccess(): boolean {
        return App.game.budget.yearlyBudget <= this.budgetRequirement;
    }

    resetUpgrades(): void {
        for (const upgrade of this.upgrades) {
            upgrade.level = 0;
        }
    }

    getBoughtUpgradesOfType(type: MiniGameUpgradeType): MiniGameUpgrade[] {
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

    getUpgrade(key: string): MiniGameUpgrade {
        for (const upgrade of this.upgrades) {
            if (upgrade.identifier === key) {
                return upgrade;
            }
        }
        return null;
    }

    loadUpgrades(data: UpgradeListSaveData): void {
        for (const key of data.upgradeKeys) {
            const upgrade = this.getUpgrade(key);
            if (key == null) {
                console.warn(`Could not load upgrade ${key}`);
            } else {
                upgrade.level = 1;
            }
        }
    }

    parseUpgradeSaveData(json: Record<string, unknown>): UpgradeListSaveData {
        const data = new UpgradeListSaveData();
        const list = json?.upgradeKeys as string[];
        if (list == null) {
            return data;
        }
        for (const key of list) {
            data.addUpgrade(key);
        }
        return data;
    }

    saveUpgrades(): UpgradeListSaveData {
        const data = new UpgradeListSaveData();
        for (const upgrade of this.upgrades) {
            if (upgrade.isBought()) {
                data.addUpgrade(upgrade.identifier);
            }
        }
        return data;
    }


}
