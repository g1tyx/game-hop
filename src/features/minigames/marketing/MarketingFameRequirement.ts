import {Requirement} from "../../../engine/requirements/Requirement";
import {App} from "../../../App";
import {MiniGameRequirement} from "../MiniGameRequirement";

export class MarketingFameRequirement extends MiniGameRequirement {
    constructor(description: string, target: number) {
        super(description, target);
    }

    getActualValue(): number {
        return App.game.miniGames.marketing.fame;
    }

}
