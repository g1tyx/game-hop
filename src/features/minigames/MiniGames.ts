import {Feature} from "../../engine/Feature";
import {MiniGamesSaveData} from "./MiniGamesSaveData";
import {DummyMiniGame} from "./dummy/DummyMiniGame";
import {MarketingMiniGame} from "./marketing/MarketingMiniGame";
import {EndOfYearReport} from "./EndOfYearReport";
import {MiniGame} from "./MiniGame";
import {BalancingMiniGame} from "./balancing/BalancingMiniGame";

export class MiniGames extends Feature {
    name: string = 'Minigames';
    saveKey: string = 'minigames';

    dummy: DummyMiniGame
    marketing: MarketingMiniGame
    balancing: BalancingMiniGame;

    constructor(dummy: DummyMiniGame, marketing: MarketingMiniGame, balancing: BalancingMiniGame) {
        super();
        this.dummy = dummy;
        this.marketing = marketing;
        this.balancing = balancing
    }

    // TODO(@Isha) add more minigames
    getMiniGames(): MiniGame[] {
        return [this.dummy, this.marketing, this.balancing];
    }

    initialize(): void {
        for (const miniGame of this.getMiniGames()) {
            miniGame.initialize();
        }
    }


    update(delta: number): void {
        for (const miniGame of this.getMiniGames()) {
            miniGame.update(delta);
        }
    }

    reset(): void {
        for (const miniGame of this.getMiniGames()) {
            miniGame.reset();
        }
    }

    getEndOfYearReport(): EndOfYearReport {
        const report = new EndOfYearReport([]);
        for (const miniGame of this.getMiniGames()) {
            for (const requirement of miniGame.yearRequirements) {
                report.addReport(requirement.getReport());
            }
        }

        return report;
    }

    load(data: MiniGamesSaveData): void {
        this.dummy.load(data.dummy);
        this.marketing.load(data.marketing);
        this.balancing.load(data.balancing);
    }

    parseSaveData(json: Record<string, unknown>): MiniGamesSaveData {
        const dummyData = this.dummy.parseSaveData(json?.dummy as Record<string, unknown>);
        const marketingData = this.marketing.parseSaveData(json?.marketing as Record<string, unknown>);
        const balancingData = this.balancing.parseSaveData(json?.balancing as Record<string, unknown>);
        return new MiniGamesSaveData(dummyData, marketingData, balancingData);

    }

    save(): MiniGamesSaveData {
        return new MiniGamesSaveData(this.dummy.save(), this.marketing.save(), this.balancing.save());
    }

}
