import {MiniGame} from "../MiniGame";
import * as ko from "knockout";
import {BugFixingRequirement} from "./BugFixingRequirement";
import {BugFixingMiniGameSaveData} from "./BugFixingMiniGameSaveData";
import {ObservableArrayProxy} from "../../../engine/knockout/ObservableArrayProxy";
import {Bug} from "./Bug";
import {Currency} from "../../wallet/Currency";
import {CurrencyType} from "../../wallet/CurrencyType";
import {MiniGameUpgradeType} from "../MiniGameUpgradeType";
import {App} from "../../../App";
import {BugFixingUpgrade} from "./BugFixingUpgrade";


export class BugFixingMiniGame extends MiniGame {
    name: string = "Bug Fixing";
    saveKey: string = "bug-fixing";

    private readonly _squashed: ko.Observable<number>;

    private readonly _actualCursor: ko.Observable<number>;

    public bugs: ObservableArrayProxy<Bug>;

    currentMonthTime: number = 0;
    movementSpeed: number = 0.1;
    lastLaneSpawned: number = 1;

    constructor(budgetRequirement: number) {
        super(budgetRequirement);
        this._squashed = ko.observable(0);
        this.yearRequirements = [];
        this._actualCursor = ko.observable(1);
        this.bugs = new ObservableArrayProxy<Bug>([]);
    }

    initialize(): void {
        this.yearRequirements.push(new BugFixingRequirement("Quality Assurance - Fix bugs", 100, 10))

        this.upgrades.push(new BugFixingUpgrade('bug-fixing-movement-cost', "Reduce the cost of switching lanes by 30%", new Currency(100, CurrencyType.money), 0.70, MiniGameUpgradeType.BugFixingMoveCost));
        this.upgrades.push(new BugFixingUpgrade('bug-fixing-value-1', "Improve bug value by 25%", new Currency(100, CurrencyType.money), 1.25, MiniGameUpgradeType.BugFixingValue));
        this.upgrades.push(new BugFixingUpgrade('bug-fixing-value-2', "Improve bug value by 30%", new Currency(150, CurrencyType.money), 1.30, MiniGameUpgradeType.BugFixingValue));
        this.upgrades.push(new BugFixingUpgrade('bug-fixing-remove-lane', "Remove a lane", new Currency(150, CurrencyType.money), 1.00, MiniGameUpgradeType.BugFixingReduceLane));
        this.upgrades.push(new BugFixingUpgrade('bug-fixing-spawn-1', "Bugs spawn 25% more often", new Currency(100, CurrencyType.money), 1.25, MiniGameUpgradeType.BugFixingSpawn));
        this.upgrades.push(new BugFixingUpgrade('bug-fixing-spawn-2', "Bugs spawn 40% more often", new Currency(150, CurrencyType.money), 1.40, MiniGameUpgradeType.BugFixingSpawn));

        this.spawnBug();
    }

    getBugsOnLane(lane: number): Bug[] {
        return this.bugs.filter(bug => bug.lane == lane);
    }

    moveUp(): void {
        if (this.actualCursor == 0) {
            return;
        }
        const switchCost = this.getSwitchCost();

        if (App.game.wallet.hasCurrency(switchCost)) {
            if (switchCost.amount > 0) {
                App.game.wallet.loseCurrency(switchCost);

            }
            this.actualCursor = Math.max(0, this.actualCursor - 1);
        }

    }

    moveDown(): void {
        if (this.actualCursor == 3) {
            return;
        }
        const switchCost = this.getSwitchCost();

        if (App.game.wallet.hasCurrency(switchCost)) {
            if (switchCost.amount > 0) {
                App.game.wallet.loseCurrency(switchCost);

            }
            this.actualCursor = Math.min(3, this.actualCursor + 1);
        }
    }

    // In months
    getSpawnTime(): number {
        return 0.09 * this.getTotalMultiplierForType(MiniGameUpgradeType.BugFixingSpawn) * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.BugFixingSpawn);
    }

    getSwitchCost(): Currency {
        return new Currency(20 * this.getTotalMultiplierForType(MiniGameUpgradeType.BugFixingMoveCost) * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.BugFixingMoveCost), CurrencyType.money);
    }

    private getLaneCount(): number {
        return Math.max(1, 4 - this.getBoughtUpgradesOfType(MiniGameUpgradeType.BugFixingReduceLane).length - App.game.prestige.skillTree.getBoughtUpgradesOfType(MiniGameUpgradeType.BugFixingReduceLane).length);
    }

    private getSquashValue() {
        return this.getTotalMultiplierForType(MiniGameUpgradeType.BugFixingValue) * App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.BugFixingValue);
    }

    update(delta: number): void {
        const monthDelta: number = App.game.yearTracker.secondsToMonthPercentage(delta);
        this.currentMonthTime += monthDelta;

        this.bugs.forEach((bug, index) => {
            bug.position -= 2 * monthDelta;
            if (bug.position <= 0) {
                if (bug.lane == this.actualCursor) {
                    this.squashed += this.getSquashValue();
                }
                this.bugs.splice(index, 1);
            }
        });

        if (this.currentMonthTime >= this.getSpawnTime()) {
            this.currentMonthTime = 0;
            this.spawnBug();
        }
    }

    spawnBug(): void {
        const shouldSwitch = this.lastLaneSpawned >= this.getLaneCount() || Math.random() < 0.4;
        const newLane = Math.floor(Math.random() * this.getLaneCount());
        const lane = shouldSwitch ? newLane : this.lastLaneSpawned;

        this.lastLaneSpawned = lane;
        this.bugs.push(new Bug(0.9, lane));
    }

    load(data: BugFixingMiniGameSaveData): void {
        this.squashed = data.squashed
        this.loadUpgrades(data.upgrades)
    }

    parseSaveData(json: Record<string, unknown>): BugFixingMiniGameSaveData {
        return new BugFixingMiniGameSaveData(json?.squashed as number ?? 0, this.parseUpgradeSaveData(json?.upgrades as Record<string, unknown>));
    }

    reset(): void {
        this.squashed = 0;
    }

    save(): BugFixingMiniGameSaveData {
        return new BugFixingMiniGameSaveData(this.squashed, this.saveUpgrades());
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
