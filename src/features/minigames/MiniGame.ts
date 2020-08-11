import {Feature} from "../../engine/Feature";
import {MiniGameRequirement} from "./MiniGameRequirement";
import {ObservableArrayProxy} from "../../engine/knockout/ObservableArrayProxy";
import {MiniGameUpgradeType} from "./MiniGameUpgradeType";
import {MiniGameUpgrade} from "./MiniGameUpgrade";
import {App} from "../../App";

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
}
