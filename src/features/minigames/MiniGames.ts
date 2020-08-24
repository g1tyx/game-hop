import * as ko from "knockout";

import {Feature} from "../../engine/Feature";
import {MiniGamesSaveData} from "./MiniGamesSaveData";
import {MarketingMiniGame} from "./marketing/MarketingMiniGame";
import {BalancingMiniGame} from "./balancing/BalancingMiniGame";
import {DesignMiniGame} from "./design/DesignMiniGame";
import {EndOfYearReport} from "./EndOfYearReport/EndOfYearReport";
import {MiniGame} from "./MiniGame";
import {App} from "../../App";
import {CurrencyType} from "../wallet/CurrencyType";
import {MiniGameUpgradeType} from "./MiniGameUpgradeType";
import {BugFixingMiniGame} from "./bugfixing/BugFixingMiniGame";

export class MiniGames extends Feature {
    name: string = 'Minigames';
    saveKey: string = 'minigames';

    marketing: MarketingMiniGame
    balancing: BalancingMiniGame;
    design: DesignMiniGame;
    bugFixing: BugFixingMiniGame;

    private readonly _endOfYearReport: ko.Observable<EndOfYearReport>;

    constructor(marketing: MarketingMiniGame, balancing: BalancingMiniGame, design: DesignMiniGame, bugFixing: BugFixingMiniGame) {
        super();
        this.marketing = marketing;
        this.balancing = balancing;
        this.design = design;
        this.bugFixing = bugFixing;
        this._endOfYearReport = ko.observable();

    }

    // TODO(@Isha) add more minigames
    getMiniGames(): MiniGame[] {
        return [this.marketing, this.balancing, this.design, this.bugFixing];
    }

    initialize(): void {
        for (const miniGame of this.getMiniGames()) {
            miniGame.initialize();
        }

    }


    update(delta: number): void {
        if (App.game.yearTracker.yearHasEnded) {
            return;
        }
        for (const miniGame of this.getMiniGames()) {
            if (miniGame.canAccess()) {
                miniGame.update(delta);
            }
        }
    }

    reset(): void {
        for (const miniGame of this.getMiniGames()) {
            miniGame.reset();
            miniGame.resetUpgrades();
        }
    }

    updateEndOfYearReport(): void {
        this.endOfYearReport = this.getEndOfYearReport();
    }

    getEndOfYearReport(): EndOfYearReport {
        const moneyLeft = App.game.wallet.currencies[CurrencyType.money];

        const report = new EndOfYearReport(App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.PrestigeCurrency), moneyLeft);
        for (const miniGame of this.getMiniGames()) {
            if (miniGame.canAccess()) {
                for (const requirement of miniGame.yearRequirements) {
                    report.addReport(requirement.getReport());
                }
            }
        }

        return report;
    }

    allRequirementsCompleted(): boolean {
        for (const miniGame of this.getMiniGames()) {
            if (miniGame.canAccess()) {
                for (const requirement of miniGame.yearRequirements) {
                    if (!requirement.isCompleted()) {
                        return false;
                    }
                }
            }
        }
        return true;

    }

    load(data: MiniGamesSaveData): void {
        this.marketing.load(data.marketing);
        this.balancing.load(data.balancing);
        this.design.load(data.design);
        this.bugFixing.load(data.bugFixing);
    }

    parseSaveData(json: Record<string, unknown>): MiniGamesSaveData {
        const marketingData = this.marketing.parseSaveData(json?.marketing as Record<string, unknown>);
        const balancingData = this.balancing.parseSaveData(json?.balancing as Record<string, unknown>);
        const designData = this.design.parseSaveData(json?.design as Record<string, unknown>);
        const bugFixingData = this.bugFixing.parseSaveData(json?.bugFixing as Record<string, unknown>);
        return new MiniGamesSaveData(marketingData, balancingData, designData, bugFixingData);

    }

    save(): MiniGamesSaveData {
        return new MiniGamesSaveData(this.marketing.save(), this.balancing.save(), this.design.save(), this.bugFixing.save());
    }

    // Knockout getters/setters
    get endOfYearReport(): EndOfYearReport {
        return this._endOfYearReport();
    }

    set endOfYearReport(value: EndOfYearReport) {
        this._endOfYearReport(value);
    }


}
