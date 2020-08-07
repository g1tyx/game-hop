import {Feature} from "../../engine/Feature";
import {PrestigeSaveData} from "./PrestigeSaveData";
import {SingleLevelUpgrade} from "../../engine/upgrades/SingleLevelUpgrade";
import {Currency} from "../wallet/Currency";
import {CurrencyType} from "../wallet/CurrencyType";
import {App} from "../../App";

export class Prestige extends Feature {
    name: string = "Prestige";
    saveKey: string = 'prestige';

    upgrades: SingleLevelUpgrade[];

    constructor() {
        super();
        this.upgrades = [];
    }

    initialize(): void {
        this.upgrades.push(new SingleLevelUpgrade('example-prestige-1', "Gain 10% more x", new Currency(10, CurrencyType.prestige), 0.10))
        this.upgrades.push(new SingleLevelUpgrade('example-prestige-2', "Gain 10% more y", new Currency(10, CurrencyType.prestige), 0.10))

        App.game.yearTracker.onYearEnd.subscribe(() => this.prestige());
    }


    prestige(): void {
        //TODO(@Isha) do all prestige things here
        console.log("Directed by Christopher Nolan");

        App.game.miniGames.progressReport();
        App.game.miniGames.reset();

        App.game.yearTracker.startNewYear();
    }

    getUpgrade(key: string): SingleLevelUpgrade {
        for (const upgrade of this.upgrades) {
            if (upgrade.identifier === key) {
                return upgrade;
            }
        }
        return null;
    }

    load(data: PrestigeSaveData): void {
        for (const key of data.upgradeKeys) {
            const upgrade = this.getUpgrade(key);
            if (key == null) {
                console.warn(`Could not load upgrade ${key}`);
            } else {
                upgrade.level = 1;
            }
        }
    }

    parseSaveData(json: Record<string, unknown>): PrestigeSaveData {
        const data = new PrestigeSaveData();
        const list = json?.upgradeKeys as string[];
        if (list == null) {
            return data;
        }
        for (const key of list) {
            data.addUpgrade(key);
        }
        return data;
    }

    save(): PrestigeSaveData {
        const data = new PrestigeSaveData();
        for (const upgrade of this.upgrades) {
            if (upgrade.isBought()) {
                data.addUpgrade(upgrade.identifier);
            }
        }
        return data;
    }

}
