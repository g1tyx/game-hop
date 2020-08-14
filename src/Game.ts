import * as ko from "knockout";
import Timeout = NodeJS.Timeout;

import {GameState} from "./GameState";
import {Feature} from "./engine/Feature";
import {Wallet} from "./features/wallet/Wallet";
import {LocalStorage} from "./engine/saving/LocalStorage";
import {Settings} from "./engine/features/settings/Settings";
import {Statistics} from "./engine/features/statistics/Statistics";
import {Achievements} from "./engine/achievements/Achievements";
import {Controller} from "./engine/controllers/Controller";
import {YearTracker} from "./features/yeartracker/YearTracker";
import {Prestige} from "./features/prestige/Prestige";
import {MiniGames} from "./features/minigames/MiniGames";
import {Budget} from "./features/budget/Budget";

export class Game {
    private _tickInterval: Timeout;

    public settings: Settings;
    public yearTracker: YearTracker;
    public prestige: Prestige
    public miniGames: MiniGames;
    public wallet: Wallet;
    public budget: Budget;
    public statistics: Statistics;
    public achievements: Achievements;

    public featureControllers: Controller[]

    private readonly _state: ko.Observable<GameState>;

    private readonly TICK_DURATION_MS = 100.0;

    constructor(settings: Settings, yearTracker: YearTracker, prestige: Prestige, miniGames: MiniGames, wallet: Wallet, budget: Budget, statistics: Statistics, achievements: Achievements) {
        this.settings = settings;
        this.yearTracker = yearTracker;
        this.prestige = prestige;
        this.miniGames = miniGames;
        this.wallet = wallet
        this.budget = budget
        this.statistics = statistics;
        this.achievements = achievements

        this.featureControllers = [];

        this._state = ko.observable(GameState.starting);
    }

    private update(): void {
        if (this.state != GameState.playing) {
            return;
        }

        for (const feature of this.getAllFeatures()) {
            feature.update(this.TICK_DURATION_MS / 1000.0)
        }
    }

    public getController(key: string): Controller {
        for (const controller of this.featureControllers) {
            if (controller.key == key) {
                return controller;
            }
        }
        console.error(`Could not load controller with key ${key}`);
        return null;
    }

    public addController(controller: Controller): void {
        this.featureControllers.push(controller);
    }

    public initialize(): void {
        for (const feature of this.getAllFeatures()) {
            feature.initialize();
        }

        for (const controller of this.featureControllers) {
            controller.initialize();
        }

        this.yearTracker.onMonthStart.subscribe(() => this.save());
    }

    public start(): void {
        if (this.state === GameState.playing) {
            console.error("Cannot start the game twice");
            return;
        }

        this._tickInterval = setInterval(() => this.update(), this.TICK_DURATION_MS);

        this.state = GameState.playing;
        console.log("Started");
    }

    public stop(): void {
        clearInterval(this._tickInterval);

        this.state = GameState.stopped;
        console.log("Stopped");
    }

    public save(): void {
        const res: Record<string, unknown> = {};
        for (const feature of this.getAllFeatures()) {
            res[feature.saveKey] = feature.save()
        }
        LocalStorage.store('save', res)
    }

    public deleteSave(): void {
        LocalStorage.delete('save');
    }

    public load(): void {
        const saveData = LocalStorage.get('save')
        for (const feature of this.getAllFeatures()) {
            const featureSavedata: Record<string, unknown> = saveData == null ? {} : saveData[feature.saveKey] as Record<string, unknown> ?? {};
            feature.load(feature.parseSaveData(featureSavedata));
        }
    }

    public getTotalMoneyMultiplier(): number {
        let res = 1;
        for (const feature of this.getAllFeatures()) {
            res *= feature.getMoneyMultiplier();
        }
        return res;
    }

    public getAllFeatures(): Feature[] {
        // TODO(@Isha) Improve with JS hacks to gain all features
        return [this.settings, this.yearTracker, this.prestige, this.miniGames, this.wallet, this.budget, this.statistics, this.achievements];
    }


    // Knockout getters/setters
    get state(): GameState {
        return this._state();
    }

    set state(value: GameState) {
        this._state(value);
    }
}
