import * as ko from "knockout";

import {ISimpleEvent, SimpleEventDispatcher} from "ste-simple-events";
import {ISignal, SignalDispatcher} from "ste-signals";

import {Feature} from "../../engine/Feature";
import {YearTrackerSaveData} from "./YearTrackerSaveData";
import {App} from "../../App";

/**
 * Year tracker to track how far into the year we are.
 *
 * Exposes observables for month, monthProgress
 * Exposes events for onMonthEnd, onMonthStart, onYearEnd, onYearStart
 */
export class YearTracker extends Feature {
    name: string = "Year Tracker";
    saveKey: string = 'year-tracker';

    public readonly monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    public currentYear: number;

    private readonly _month: ko.Observable<number>;
    private readonly _monthProgress: ko.Observable<number>

    private readonly _onMonthEnd = new SimpleEventDispatcher<number>();
    private readonly _onMonthStart = new SimpleEventDispatcher<number>();
    private readonly _onYearStart = new SignalDispatcher();
    private readonly _onYearEnd = new SignalDispatcher();

    private _isStarted: boolean = false;

    private readonly baseRealMonthTime: number;
    private realMonthTime: number;
    private _yearHasEnded: ko.Observable<boolean>;

    constructor(realMonthTime: number) {
        super();
        this.currentYear = 1;
        this.baseRealMonthTime = realMonthTime;
        this.realMonthTime = realMonthTime;
        this._yearHasEnded = ko.observable(false);
        this._month = ko.observable(0);
        this._monthProgress = ko.observable(0);

    }

    initialize(): void {
    }

    startNewYear(): void {
        App.game.wallet.currencies[0] = 0;
        this.realMonthTime = this.baseRealMonthTime;
        this.reset();
        this._onYearStart.dispatch();
        this._onMonthStart.dispatch(0);
    }

    endYearEarly(): void {
        if (App.game.miniGames.allRequirementsCompleted()) {
            this.realMonthTime = 0.01;
        }
    }

    update(delta: number): void {
        if (!this._isStarted) {
            this._isStarted = true;
            this.startNewYear();
        }
        if (this.yearHasEnded) {
            return;
        }
        this.monthProgress += this.secondsToMonthPercentage(delta);
        if (this.monthProgress >= 1) {
            this.nextMonth();
        }
    }

    reset(): void {
        this.month = 0;
        this.monthProgress = 0;
        this.yearHasEnded = false;
    }

    nextMonth(): void {
        if (this.yearHasEnded) {
            console.error("Cannot go to next month when year is ended");
            return;
        }

        this._onMonthEnd.dispatch(this.month);
        this.month++;
        this.monthProgress = 0;

        // 11 is the last year, so 12 after incrementing
        if (this.month == 12) {
            this.yearEnd();
            return;
        }
        this._onMonthStart.dispatch(this.month);
    }

    yearEnd(): void {
        this.yearHasEnded = true;
        this.currentYear++;
        this._onYearEnd.dispatch();
    }

    secondsToMonthPercentage(seconds: number): number {
        return seconds / this.realMonthTime;
    }

    load(data: YearTrackerSaveData): void {
        this.currentYear = data.year;
        this.month = data.month;
        this.monthProgress = data.monthProgress
        this._isStarted = data.isStarted;
        this.yearHasEnded = data.hasEnded;
    }

    parseSaveData(json: Record<string, unknown>): YearTrackerSaveData {
        const year = json?.year as number ?? 1;
        const month = json?.month as number ?? 0;
        const monthProgress = json?.monthProgress as number ?? 0;
        const isStarted = json?.isStarted as boolean ?? false;
        const hasEnded = json?.hasEnded as boolean ?? false;
        return new YearTrackerSaveData(year, month, monthProgress, isStarted, hasEnded);
    }

    save(): YearTrackerSaveData {
        return new YearTrackerSaveData(this.currentYear, this.month, this.monthProgress, this._isStarted, this.yearHasEnded);
    }

    // Event getters/setters
    public get onMonthStart(): ISimpleEvent<number> {
        return this._onMonthStart.asEvent();
    }

    public get onMonthEnd(): ISimpleEvent<number> {
        return this._onMonthEnd.asEvent();
    }

    public get onYearStart(): ISignal {
        return this._onYearStart.asEvent();
    }

    public get onYearEnd(): ISignal {
        return this._onYearEnd.asEvent();
    }

    // Knockout getters/setters
    get yearHasEnded(): boolean {
        return this._yearHasEnded();
    }

    set yearHasEnded(value: boolean) {
        this._yearHasEnded(value);
    }

    get month(): number {
        return this._month();
    }

    set month(value: number) {
        this._month(value);
    }

    get monthProgress(): number {
        return this._monthProgress();
    }

    set monthProgress(value: number) {
        this._monthProgress(value);
    }
}
