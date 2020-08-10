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
        this.skillTree.addUpgrade(new SkillTreeUpgrade(MiniGameUpgradeType.MarketingFame, new SingleLevelUpgrade('marketing-fame-1', "Gain 10% more fame", new Currency(10, CurrencyType.prestige), 1.10)))
        this.skillTree.addUpgrade(new SkillTreeUpgrade(MiniGameUpgradeType.MarketingFame, new SingleLevelUpgrade('marketing-fame-2', "Gain 20% more fame", new Currency(10, CurrencyType.prestige), 1.20), [new SkillTreeRequirement('marketing-fame-1')]))

        App.game.yearTracker.onYearEnd.subscribe(() => this.prestige());
    }


    prestige(): void {
        //TODO(@Isha) do all prestige things here
        console.log("Directed by Christopher Nolan");

        const report = App.game.miniGames.getEndOfYearReport();
        report.print();
        let reward = 0;
        for (const rep of report.reports) {
            reward += rep.getPercentage();
        }

        App.game.wallet.gainPrestige(reward * 300 + 1);
        App.game.miniGames.reset();

        App.game.yearTracker.startNewYear();
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
