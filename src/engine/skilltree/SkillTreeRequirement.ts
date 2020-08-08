import {Requirement} from "../requirements/Requirement";
import {SkillTree} from "./SkillTree";

export class SkillTreeRequirement extends Requirement {
    skillTree: SkillTree

    upgradeKey: string;

    constructor(upgradeKey: string) {
        super();
        this.upgradeKey = upgradeKey;
    }

    // TODO(@Isha) change to App.game.miniGames.marketing.skillTree.getUpgrade(this.upgradeKey).level;
    getActualValue(): number {
        // return App.game.miniGames.marketing.skillTree.getUpgrade(this.upgradeKey).level;
        return 0;
    }

    getTargetValue(): number {
        return 1;
    }

    lockedReason(): string {
        return "Locked";
    }

}
