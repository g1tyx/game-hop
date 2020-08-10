import {Requirement} from "../../engine/requirements/Requirement";
import {MiniGameReport} from "./MiniGameReport";

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
        return this.target;
    }

    getReport(): MiniGameReport {
        return new MiniGameReport(this.description, Math.min(this.getActualValue(), this.getTargetValue()), this.getTargetValue(), this.basePrestigeReward);
    }

    lockedReason(): string {
        return "Not used";
    }


}
