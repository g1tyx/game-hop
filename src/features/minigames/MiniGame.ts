import {Feature} from "../../engine/Feature";
import {MiniGameRequirement} from "./MiniGameRequirement";
import {ObservableArrayProxy} from "../../engine/knockout/ObservableArrayProxy";
import {MiniGameUpgradeType} from "./MiniGameUpgradeType";
import {MiniGameUpgrade} from "./MiniGameUpgrade";

export abstract class MiniGame extends Feature {
    abstract reset(): void

    upgrades: ObservableArrayProxy<MiniGameUpgrade>;
    yearRequirements: MiniGameRequirement[];

    protected constructor() {
        super();
        this.yearRequirements = [];
        this.upgrades = new ObservableArrayProxy<MiniGameUpgrade>([]);
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
