import {RequirementProgress} from "./RequirementProgress";

export abstract class Requirement {

    isCompleted(): boolean {
        return this.getActualValue() >= this.getTargetValue();
    }

    getProgress(): RequirementProgress {
        const targetValue = this.getTargetValue();
        return new RequirementProgress(Math.min(this.getActualValue(), targetValue), targetValue);
    }

    getProgressString(): string {
        const targetValue = this.getTargetValue();
        return `${Math.min(this.getActualValue(), targetValue).toFixed(2)}/${targetValue}`;
    }

    abstract lockedReason(): string;

    abstract getActualValue(): number;

    abstract getTargetValue(): number;
}
