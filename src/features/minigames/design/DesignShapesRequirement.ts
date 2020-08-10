import {App} from "../../../App";
import {MiniGameRequirement} from "../MiniGameRequirement";

export class DesignShapesRequirement extends MiniGameRequirement {
    constructor(description: string, target: number, prestigeReward: number) {
        super(description, target, prestigeReward);
    }

    getActualValue(): number {
        return App.game.miniGames.design.shapesCorrect;
    }

}
