import {Feature} from "../../engine/Feature";
import {MiniGamesSaveData} from "./MiniGamesSaveData";
import {DummyMiniGame} from "./dummy/DummyMiniGame";
import {MarketingMiniGame} from "./marketing/MarketingMiniGame";
import {EndOfYearReport} from "./EndOfYearReport";
import {MiniGameReport} from "./MiniGameReport";

export class MiniGames extends Feature {
    name: string = 'Minigames';
    saveKey: string = 'minigames';

    dummy: DummyMiniGame
    marketing: MarketingMiniGame

    constructor(dummy: DummyMiniGame, marketing: MarketingMiniGame) {
        super();
        this.dummy = dummy;
        this.marketing = marketing;
    }


    initialize(): void {
        this.dummy.initialize();
        this.marketing.initialize();
    }


    update(delta: number): void {
        this.dummy.update(delta);
        this.marketing.update(delta);
    }

    reset(): void {
        this.dummy.reset();
        this.marketing.reset();
    }

    getEndOfYearReport(): EndOfYearReport {
        const report = new EndOfYearReport([]);
        for (const requirement of this.dummy.yearRequirements) {
            report.addReport(requirement.getReport());
        }
        for (const requirement of this.marketing.yearRequirements) {
            report.addReport(requirement.getReport());
        }
        return report;
    }

    load(data: MiniGamesSaveData): void {
        this.dummy.load(data.dummy);
        this.marketing.load(data.marketing);
    }

    parseSaveData(json: Record<string, unknown>): MiniGamesSaveData {
        const dummyData = this.dummy.parseSaveData(json?.dummy as Record<string, unknown>);
        const marketingData = this.marketing.parseSaveData(json?.marketing as Record<string, unknown>);
        return new MiniGamesSaveData(dummyData, marketingData);

    }

    save(): MiniGamesSaveData {
        return new MiniGamesSaveData(this.dummy.save(), this.marketing.save());
    }

}
