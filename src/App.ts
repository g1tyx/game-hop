import {Game} from "./Game";
import {Wallet} from "./features/wallet/Wallet";
import {Settings} from "./engine/features/settings/Settings";
import {Statistics} from "./engine/features/statistics/Statistics";
import {Achievements} from "./engine/achievements/Achievements";
import {AchievementsController} from "./engine/achievements/AchievementsController";
import {YearTracker} from "./features/yeartracker/YearTracker";
import {Prestige} from "./features/prestige/Prestige";
import {MiniGames} from "./features/minigames/MiniGames";
import {MarketingMiniGame} from "./features/minigames/marketing/MarketingMiniGame";
import {BalancingMiniGame} from "./features/minigames/balancing/BalancingMiniGame";
import {DesignMiniGame} from "./features/minigames/design/DesignMiniGame";
import {Budget} from "./features/budget/Budget";
import {YearTrackerController} from "./controllers/YearTrackerController";
import {BugFixingMiniGame} from "./features/minigames/bugfixing/BugFixingMiniGame";
import {LocalStorage} from "./engine/saving/LocalStorage";

import * as $ from 'jquery';

export class App {

    static readonly debug = false;
    static game: Game;

    static start(): void {
        App.game = this.createNewGame();

        App.game.addController(new AchievementsController(App.game.achievements));
        App.game.addController(new YearTrackerController());

        App.game.initialize();


        App.game.load();

        const saveData = LocalStorage.get('save')
        if (saveData == null) {
            $("#introModal").show();
        } else {
            App.game.start();
        }

    }


    static createNewGame(): Game {
        return new Game(
            new Settings(),
            new YearTracker(10.0),
            new Prestige(),
            new MiniGames(
                new MarketingMiniGame(650),
                new BalancingMiniGame(999),
                new DesignMiniGame(350),
                new BugFixingMiniGame(1000),
            ),
            new Wallet(),
            new Budget(),
            new Statistics(),
            new Achievements(),
        );
    }
}
