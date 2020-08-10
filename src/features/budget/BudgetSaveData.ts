import {SaveData} from "../../engine/saving/SaveData";

export class BudgetSaveData extends SaveData {
    budget: number;

    constructor(budget: number) {
        super();
        this.budget = budget;
    }
}
