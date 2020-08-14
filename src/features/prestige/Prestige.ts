import {Feature} from "../../engine/Feature";
import {PrestigeSaveData} from "./PrestigeSaveData";
import {SingleLevelUpgrade} from "../../engine/upgrades/SingleLevelUpgrade";
import {Currency} from "../wallet/Currency";
import {CurrencyType} from "../wallet/CurrencyType";
import {App} from "../../App";
import {SkillTree} from "../../engine/skilltree/SkillTree";
import {SkillTreeUpgrade} from "../../engine/skilltree/SkillTreeUpgrade";
import {MiniGameUpgradeType} from "../minigames/MiniGameUpgradeType";
import {SkillTreeRequirement} from "../../engine/skilltree/SkillTreeRequirement";

export class Prestige extends Feature {
    name: string = "Prestige";
    saveKey: string = 'prestige';

    skillTree: SkillTree;

    constructor() {
        super();
        this.skillTree = new SkillTree([]);
    }

    initialize(): void {
        // Inner global upgrades
        this.addPrestigeUpgrade("global-unlock-minigame-upgrades", MiniGameUpgradeType.UnlockMiniGameUpgrades, "Unlock Minigame Upgrades", 10, 1);
        this.addPrestigeUpgrade("global-yearly-requirements", MiniGameUpgradeType.MiniGameYearlyRequirements, "Reduce Yearly Requirements for all minigames by 10%", 200, 0.9, ['design-value-1', 'development-focus-gain-1']);
        this.addPrestigeUpgrade("global-prestige-upgrade-cost", MiniGameUpgradeType.PrestigeUpgradeCost, "Reduce all prestige upgrade costs by 10%", 200, 0.9, ['marketing-fame-1', 'design-value-1']);
        this.addPrestigeUpgrade("global-minigame-upgrade-cost", MiniGameUpgradeType.MiniGameUpgradeCost, "Reduce all minigame upgrade costs by 20%", 200, 0.80, ['debugging-reduce-movement-cost-1', 'development-focus-gain-1']);
        this.addPrestigeUpgrade("global-prestige-multiplier", MiniGameUpgradeType.PrestigeCurrency, "Gain 20% more prestige points", 200, 1.20, ['marketing-fame-1', 'debugging-reduce-movement-cost-1']);


        // Marketing
        this.addPrestigeUpgrade("marketing-fame-1", MiniGameUpgradeType.MarketingFame, "Increase marketing Fame by 50%", 50, 1.5, ['global-unlock-minigame-upgrades']);
        this.addPrestigeUpgrade("marketing-speed-1", MiniGameUpgradeType.MarketingSpeed, "Increase marketing speed by 50%", 50, 0.5, ['marketing-fame-1']);
        this.addPrestigeUpgrade("marketing-cost-1", MiniGameUpgradeType.MarketingCost, "Reduce marketing cost by 50%", 50, 0.5, ['marketing-fame-1']);
        this.addPrestigeUpgrade("marketing-upgrade-cost-1", MiniGameUpgradeType.MarketingUpgradeCost, "Reduce marketing upgrade costs by 30%", 50, 0.7, ['marketing-speed-1', 'marketing-cost-1']);
        this.addPrestigeUpgrade("marketing-minigame-upgrade-cost", MiniGameUpgradeType.MiniGameUpgradeCost, "Reduce all minigame upgrade costs by 25%", 250, 0.75, ['marketing-upgrade-cost-1']);
        this.addPrestigeUpgrade("marketing-fame-2", MiniGameUpgradeType.MarketingFame, "Increase marketing Fame gain by 50%", 50, 1.5, ['marketing-cost-1']);
        this.addPrestigeUpgrade("marketing-cost-2", MiniGameUpgradeType.MarketingCost, "Reduce marketing cost by 50%", 50, 0.5, ['marketing-fame-2']);
        this.addPrestigeUpgrade("marketing-speed-2", MiniGameUpgradeType.MarketingSpeed, "Increase marketing speed by 50%", 50, 0.5, ['marketing-fame-2']);

        // Design
        this.addPrestigeUpgrade("design-value-1", MiniGameUpgradeType.DesignShapeValue, "Increase design value by 50%", 50, 1.5, ['global-unlock-minigame-upgrades']);
        this.addPrestigeUpgrade("design-remove-option-1", MiniGameUpgradeType.DesignReduceOptions, "Remove an incorrect option", 50, 1, ['design-value-1']);
        this.addPrestigeUpgrade("design-reduce-wrong-penalty-1", MiniGameUpgradeType.DesignReduceWrongPenalty, "Reduce the penalty for wrong answers by 1", 250, 1, ['design-remove-option-1']);
        this.addPrestigeUpgrade("design-remove-option-2", MiniGameUpgradeType.DesignReduceOptions, "Remove an incorrect option", 50, 1, ['design-reduce-wrong-penalty-1']);
        this.addPrestigeUpgrade("design-value-2", MiniGameUpgradeType.DesignShapeValue, "Increase design value by 50%", 50, 1.5, ['design-remove-option-1']);
        this.addPrestigeUpgrade("design-minigame-upgrade-cost", MiniGameUpgradeType.DesignUpgradeCost, "Reduce design upgrade costs by 30%", 50, 0.7, ['design-value-2']);
        this.addPrestigeUpgrade("design-reduce-wrong-penalty-2", MiniGameUpgradeType.DesignReduceWrongPenalty, "Reduce the penalty for wrong answers by 1", 500, 1, ['design-value-2']);
        this.addPrestigeUpgrade("design-prestige-multiplier", MiniGameUpgradeType.PrestigeCurrency, "Increase prestige points gain by 25%", 500, 1.25, ['design-reduce-wrong-penalty-2']);

        // Debugging
        this.addPrestigeUpgrade("debugging-reduce-movement-cost-1", MiniGameUpgradeType.BugFixingMoveCost, "Reduce movement cost by 20%", 50, 0.80, ['global-unlock-minigame-upgrades']);
        this.addPrestigeUpgrade("debugging-reduce-lane-1", MiniGameUpgradeType.BugFixingReduceLane, "Bugs spawning on one less lane", 50, 1, ['debugging-reduce-movement-cost-1']);
        this.addPrestigeUpgrade("debugging-reduce-movement-cost-2", MiniGameUpgradeType.BugFixingMoveCost, "Reduce movement cost by 20%", 50, 0.80, ['debugging-reduce-lane-1']);
        this.addPrestigeUpgrade("debugging-reduce-lane-2", MiniGameUpgradeType.BugFixingReduceLane, "Bugs spawning on one less lane", 50, 1, ['debugging-reduce-movement-cost-2']);
        this.addPrestigeUpgrade("debugging-improve-spawn-1", MiniGameUpgradeType.BugFixingSpawn, "Improve spawn rate by 20%", 50, 1.20, ['debugging-reduce-lane-1']);
        this.addPrestigeUpgrade("debugging-reduce-movement-cost-3", MiniGameUpgradeType.BugFixingMoveCost, "Remove movement cost", 250, 0, ['debugging-improve-spawn-1', 'debugging-reduce-lane-2']);
        this.addPrestigeUpgrade("debugging-improve-value-1", MiniGameUpgradeType.BugFixingValue, "Improve bug value by 25%", 50, 1.25, ['debugging-reduce-lane-1']);
        this.addPrestigeUpgrade("debugging-improve-value-2", MiniGameUpgradeType.BugFixingValue, "Improve bug value by 25%", 50, 1.25, ['debugging-improve-value-1']);
        this.addPrestigeUpgrade("debugging-reduce-yearly-requirements", MiniGameUpgradeType.MiniGameYearlyRequirements, "Reduce yearly requirements for all minigames cost by 20%", 50, 0.80, ['debugging-improve-value-2']);

        // Development
        this.addPrestigeUpgrade("development-focus-gain-1", MiniGameUpgradeType.BalancingFocusGain, "Improve focus gain by 20%", 50, 1.20, ['global-unlock-minigame-upgrades']);
        this.addPrestigeUpgrade("development-movement-speed-1", MiniGameUpgradeType.BalancingMovementSpeed, "Improve movement speed by 20%", 25, 1.20, ['development-focus-gain-1']);
        this.addPrestigeUpgrade("development-reduce-target-movement-1", MiniGameUpgradeType.BalancingTargetMovement, "Reduce target movement by 30%", 50, 0.7, ['development-movement-speed-1']);
        this.addPrestigeUpgrade("development-minigame-upgrade-cost-1", MiniGameUpgradeType.BalancingUpgradeCost, "Reduce development upgrade cost by 30%", 50, 0.7, ['development-movement-speed-1']);
        this.addPrestigeUpgrade("development-reduce-target-movement-2", MiniGameUpgradeType.BalancingTargetMovement, "Reduce target movement by 30%", 50, 0.7, ['development-focus-gain-1']);
        this.addPrestigeUpgrade("development-reduce-target-movement-3", MiniGameUpgradeType.BalancingTargetMovement, "Remove target movement", 800, Infinity, ['development-movement-speed-2']);
        this.addPrestigeUpgrade("development-prestige-upgrade-cost", MiniGameUpgradeType.PrestigeUpgradeCost, "Reduce prestige upgrade cost by 15%", 800, 0.85, ['development-minigame-upgrade-cost-1']);
        this.addPrestigeUpgrade("development-movement-speed-2", MiniGameUpgradeType.BalancingMovementSpeed, "Improve movement speed by 40%", 50, 1.40, ['development-minigame-upgrade-cost-1']);
        this.addPrestigeUpgrade("development-focus-gain-2", MiniGameUpgradeType.BalancingFocusGain, "Improve focus gain by 50%", 50, 1.50, ['development-reduce-target-movement-2']);

    }

    addPrestigeUpgrade(identifier: string, type: MiniGameUpgradeType, displayName: string, cost: number, bonus: number, requirementStrings: string[] = []): void {
        let shortHand = identifier.split("-").join(" ");

        const requirements: SkillTreeRequirement[] = [];
        for (const req of requirementStrings) {
            requirements.push(new SkillTreeRequirement(req));
        }
        shortHand = shortHand.charAt(0).toUpperCase() + shortHand.slice(1);
        this.skillTree.addUpgrade(
            new SkillTreeUpgrade(shortHand, type,
                new SingleLevelUpgrade(identifier, displayName,
                    new Currency(cost, CurrencyType.prestige), bonus),
                requirements
            )
        );

    }

    prestige(): void {
        //TODO(@Isha) do all prestige things here
        console.log("Directed by Christopher Nolan");

        App.game.miniGames.updateEndOfYearReport()
        const report = App.game.miniGames.endOfYearReport;
        report.print();

        App.game.wallet.resetMoney();

        if (report.isCompleted()) {
            App.game.budget.shrinkBudget(report.moneyLeft);
        }

        App.game.wallet.gainPrestige(report.getTotalReward());
        App.game.miniGames.reset();
    }

    getUpgrade(key: string): SkillTreeUpgrade {
        return this.skillTree.getUpgrade(key);
    }

    load(data: PrestigeSaveData): void {
        this.skillTree.load(data.skillTree);
    }

    parseSaveData(json: Record<string, unknown>): PrestigeSaveData {
        return new PrestigeSaveData(this.skillTree.parseSaveData(json?.skillTree as Record<string, unknown>));
    }

    save(): PrestigeSaveData {
        return new PrestigeSaveData(this.skillTree.save());
    }

}
