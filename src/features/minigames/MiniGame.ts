import {Requirement} from "../../engine/requirements/Requirement";

export interface MiniGame {
    reset(): void

    yearRequirements: Requirement[];
}
