import {Requirement} from "../../engine/requirements/Requirement";
import {MiniGameReport} from "./MiniGameReport";
import {App} from "../../App";
import {MiniGameUpgradeType} from "./MiniGameUpgradeType";

export abstract class MiniGameRequirement extends Requirement {
    description: string;
    target: number;
    basePrestigeReward: number;

    protected constructor(description: string, target: number, basePrestigeReward: number) {
        super();
        this.description = description;
        this.target = target;
        this.basePrestigeReward = basePrestigeReward;
    }

    abstract getActualValue(): number;

    getTargetValue(): number {
        return this.target * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.MiniGameYearlyRequirements);
    }

    getReport(): MiniGameReport {
        return new MiniGameReport(this.description, Math.min(this.getActualValue(), this.getTargetValue()), this.getTargetValue(), this.basePrestigeReward);
    }

    lockedReason(): string {
        return "Not used";
    }


}
