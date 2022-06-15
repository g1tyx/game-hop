import {SkillTreeSaveData} from "../../engine/skilltree/SkillTreeSaveData";

export class PrestigeSaveData {
    skillTree: SkillTreeSaveData;

    constructor(skillTree: SkillTreeSaveData) {
        this.skillTree = skillTree;
    }
}
