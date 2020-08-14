import {Feature} from "../../engine/Feature";
import {PrestigeSaveData} from "./PrestigeSaveData";
import {SingleLevelUpgrade} from "../../engine/upgrades/SingleLevelUpgrade";
import {Currency} from "../wallet/Currency";
import {CurrencyType} from "../wallet/CurrencyType";
import {App} from "../../App";
import {SkillTree} from "../../engine/skilltree/SkillTree";
import {SkillTreeUpgrade} from "../../engine/skilltree/SkillTreeUpgrade";
import {MiniGameUpgradeType} from "../minigames/MiniGameUpgradeType";

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
        this.addPrestigeUpgrade("Unlock Minigame Upgrades", MiniGameUpgradeType.UnlockMiniGameUpgrades, "Unlock Minigame Upgrades", 10, 1);
        this.addPrestigeUpgrade("Yearly Requirements", MiniGameUpgradeType.MiniGameYearlyRequirements, "Reduce Yearly Requirements by 10%", 50, 0.9);


    }

    addPrestigeUpgrade(shortHand: string, type: MiniGameUpgradeType, displayName: string, cost: number, bonus: number): void {
        const identifier = shortHand.toLowerCase().replace(" ", "-");
        this.skillTree.addUpgrade(
            new SkillTreeUpgrade(shortHand, type,
                new SingleLevelUpgrade(identifier, displayName,
                    new Currency(cost, CurrencyType.prestige), bonus)
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
