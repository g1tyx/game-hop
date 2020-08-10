import {App} from "../../../App";
import {MiniGameRequirement} from "../MiniGameRequirement";

export class BalancingFocusRequirement extends MiniGameRequirement {
    constructor(description: string, target: number) {
        super(description, target);
    }

    getActualValue(): number {
        return App.game.miniGames.balancing.focus;
    }

}
