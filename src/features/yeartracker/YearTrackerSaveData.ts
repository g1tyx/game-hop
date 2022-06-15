export class YearTrackerSaveData {
    year: number;
    month: number;
    monthProgress: number;
    isStarted: boolean;
    hasEnded: boolean;


    constructor(year: number, month: number, monthProgress: number, isStarted: boolean, hasEnded: boolean) {
        this.year = year;
        this.month = month;
        this.monthProgress = monthProgress;
        this.isStarted = isStarted;
        this.hasEnded = hasEnded;
    }
}
