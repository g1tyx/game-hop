import {MiniGame} from "../MiniGame";
import {Feature} from "../../../engine/Feature";
import {Requirement} from "../../../engine/requirements/Requirement";
import {MarketingMiniGameSaveData} from "./MarketingMiniGameSaveData";
import {MarketingFameRequirement} from "./MarketingFameRequirement";

export class MarketingMiniGame extends Feature implements MiniGame {
    name: string = "Marketing";
    saveKey: string = "marketing";
    yearRequirements: Requirement[];

    fame: number;

    constructor() {
        super();
        this.yearRequirements = [];
    }

    initialize(): void {
        this.yearRequirements.push(new MarketingFameRequirement(1000));
    }

    load(data: MarketingMiniGameSaveData): void {
    }

    parseSaveData(json: Record<string, unknown>): MarketingMiniGameSaveData {
        return undefined;
    }

    reset(): void {
    }

    save(): MarketingMiniGameSaveData {
        return undefined;
    }

}
