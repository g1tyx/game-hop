import {Game} from "./Game";
import {Wallet} from "./features/wallet/Wallet";
import {Settings} from "./engine/features/settings/Settings";
import {Statistics} from "./engine/features/statistics/Statistics";
import {Achievements} from "./engine/achievements/Achievements";
import {AchievementsController} from "./engine/achievements/AchievementsController";
import {YearTracker} from "./features/yeartracker/YearTracker";
import {Prestige} from "./features/prestige/Prestige";
import {MiniGames} from "./features/minigames/MiniGames";
import {DummyMiniGame} from "./features/minigames/dummy/DummyMiniGame";
import {MarketingMiniGame} from "./features/minigames/marketing/MarketingMiniGame";
import {BalancingMiniGame} from "./features/minigames/balancing/BalancingMiniGame";
import {DesignMiniGame} from "./features/minigames/design/DesignMiniGame";
import {Budget} from "./features/budget/Budget";

export class App {

    static readonly debug = false;
    static game: Game;

    static start(): void {
        App.game = this.createNewGame();

        App.game.addController(new AchievementsController(App.game.achievements));

        App.game.initialize();
        App.game.load();
        App.game.start();
    }

    static createNewGame(): Game {
        return new Game(
            new Settings(),
            new YearTracker(15.0),
            new Prestige(),
            new MiniGames(
                new DummyMiniGame(),
                new MarketingMiniGame(),
                new BalancingMiniGame(),
                new DesignMiniGame()
            ),
            new Wallet(),
            new Budget(),
            new Statistics(),
            new Achievements(),
        );
    }
}
