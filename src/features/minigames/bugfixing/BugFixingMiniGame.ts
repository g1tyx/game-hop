import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {BugFixingRequirement} from "./BugFixingRequirement";
import {BugFixingMiniGameSaveData} from "./BugFixingMiniGameSaveData";
import {ObservableArrayProxy} from "../../../engine/knockout/ObservableArrayProxy";
import {Bug} from "./Bug";


export class BugFixingMiniGame extends MiniGame {
    name: string = "Bug Fixing";
    saveKey: string = "bug-fixing";

    private readonly _squashed: ko.Observable<number>;

    private readonly _actualCursor: ko.Observable<number>;

    public bugs: ObservableArrayProxy<Bug>;

    spawnTicks: number = 20;
    currentTicks: number = 0;
    movementSpeed: number = 0.1;
    lastLaneSpawned: number = 1;

    constructor(budgetRequirement: number) {
        super(budgetRequirement);
        this._squashed = ko.observable(0);
        this.yearRequirements = [];
        this._actualCursor = ko.observable(1);
        this.bugs = new ObservableArrayProxy<Bug>([]);
    }

    moveUp(): void {
        this.actualCursor = Math.max(0, this.actualCursor - 1);
    }

    moveDown(): void {
        this.actualCursor = Math.min(this.getLaneCount() - 1, this.actualCursor + 1);
    }

    private getLaneCount(): number {
        return 4;
    }

    private getSquashValue() {
        return 1;
    }

    update(delta: number): void {
        this.currentTicks++;

        this.bugs.forEach((bug, index) => {
            bug.position -= 0.1 * delta;
            if (bug.position <= 0) {
                if (bug.lane == this.actualCursor) {
                    this.squashed += this.getSquashValue();
                }
                this.bugs.splice(index, 1);
            }
        });

        if (this.currentTicks >= this.spawnTicks) {
            this.currentTicks = 0;
            this.spawnBug();
        }
    }

    spawnBug(): void {
        const lane = Math.random() < 0.6 ? this.lastLaneSpawned : Math.floor(Math.random() * this.getLaneCount());
        this.bugs.push(new Bug(1, lane));
    }


    initialize(): void {
        this.yearRequirements.push(new BugFixingRequirement("Quality Assurance - Fix bugs", 1000, 100))

        this.spawnBug();
    }

    load(data: BugFixingMiniGameSaveData): void {
        this.squashed = data.squashed
    }

    parseSaveData(json: Record<string, unknown>): BugFixingMiniGameSaveData {
        return new BugFixingMiniGameSaveData(json?.squashed as number ?? 0);
    }

    reset(): void {
        this.squashed = 0;
    }

    save(): BugFixingMiniGameSaveData {
        return new BugFixingMiniGameSaveData(this.squashed);
    }

    // Knockout getters/setters
    get squashed(): number {
        return this._squashed();
    }

    set squashed(value: number) {
        this._squashed(value);
    }

    get actualCursor(): number {
        return this._actualCursor();
    }

    set actualCursor(value: number) {
        this._actualCursor(value);
    }

}
