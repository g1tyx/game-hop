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

    reset(): void {
        this.dummy.reset();
    }

    progressReport(): void {
        for (const requirement of this.dummy.yearRequirements) {
            console.log(requirement.getProgressString());
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
