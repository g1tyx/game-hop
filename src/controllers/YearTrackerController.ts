import * as $ from 'jquery';

import {Controller} from "../engine/controllers/Controller";
import {App} from "../App";

export class YearTrackerController extends Controller {

    constructor() {
        super();
    }

    initialize(): void {
        App.game.yearTracker.onYearEnd.subscribe(() => this.endOfYear())
    }

    endOfYear(): void {
        App.game.stop();
        App.game.prestige.prestige();
        $("#reportPanel-label").click();
    }

}
