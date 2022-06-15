import * as $ from 'jquery';

import {Controller} from "../engine/controllers/Controller";
import {App} from "../App";

export class YearTrackerController extends Controller {

    lastBudget: number = 1001;

    constructor() {
        super('year-tracker');
    }

    initialize(): void {
        App.game.yearTracker.onYearEnd.subscribe(() => this.endOfYear())
        App.game.budget.onBudgetIsGone.subscribe(() => this.youWin())
    }

    youWin(): void {
        console.log("You win!");
        $("#winModal").show();
    }

    endOfYear(): void {
        App.game.stop();
        App.game.prestige.prestige();
        $("#reportPanel-label").click();
    }

    startNewYear(): void {
        const newBudget = App.game.budget.yearlyBudget;
        let modalShown: boolean = false;

        if (newBudget <= App.game.miniGames.design.budgetRequirement && this.lastBudget >= App.game.miniGames.design.budgetRequirement) {
            $("#designModal").show();
            modalShown = true;
        }

        if (newBudget <= App.game.miniGames.marketing.budgetRequirement && this.lastBudget >= App.game.miniGames.marketing.budgetRequirement) {
            $("#marketModal").show();
            modalShown = true;
        }

        if (newBudget <= App.game.miniGames.balancing.budgetRequirement && this.lastBudget >= App.game.miniGames.balancing.budgetRequirement) {
            $("#devModal").show();
            modalShown = true;
        }

        if (!modalShown) {
            App.game.startNewYear();
        }

        this.lastBudget = newBudget;

        $("#jobsPanel-label").click();
    }

}
