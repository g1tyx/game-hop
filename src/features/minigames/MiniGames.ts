import {Feature} from "../../engine/Feature";
import {MiniGamesSaveData} from "./MiniGamesSaveData";
import {DummyMiniGameSaveData} from "./dummy/DummyMiniGameSaveData";
import {DummyMiniGame} from "./dummy/DummyMiniGame";

export class MiniGames extends Feature {
    name: string = 'Minigames';
    saveKey: string = 'minigames';

    dummy: DummyMiniGame

    constructor(dummy: DummyMiniGame) {
        super();
        this.dummy = dummy;
    }

    initialize(): void {
        this.dummy.initialize();
    }

    progressReport(): void {
        for (const requirement of this.dummy.yearRequirements) {
            const progress = requirement.getProgress();
            console.log(progress.actual, "/", progress.target);
        }
    }

    load(data: MiniGamesSaveData): void {
        this.dummy.load(data.dummy);
    }

    parseSaveData(json: Record<string, unknown>): MiniGamesSaveData {
        const dummyData = this.dummy.parseSaveData(json?.dummy as Record<string, unknown>);
        return new MiniGamesSaveData(dummyData);

    }

    save(): MiniGamesSaveData {
        return new MiniGamesSaveData(this.dummy.save() as DummyMiniGameSaveData);
    }

}
