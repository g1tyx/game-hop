import {Requirement} from "../requirements/Requirement";
import {SkillTree} from "./SkillTree";
import {App} from "../../App";

export class SkillTreeRequirement extends Requirement {
    skillTree: SkillTree

    upgradeKey: string;

    constructor(upgradeKey: string) {
        super();
        this.upgradeKey = upgradeKey;
    }

    getActualValue(): number {
        return App.game.prestige.skillTree.getUpgrade(this.upgradeKey).level;
    }

    getTargetValue(): number {
        return 1;
    }

    lockedReason(): string {
        return "Locked";
    }

}
