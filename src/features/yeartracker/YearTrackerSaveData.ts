export class YearTrackerSaveData {
    month: number;
    monthProgress: number;
    isStarted: boolean;
    hasEnded: boolean;


    constructor(month: number, monthProgress: number, isStarted: boolean, hasEnded: boolean) {
        this.month = month;
        this.monthProgress = monthProgress;
        this.isStarted = isStarted;
        this.hasEnded = hasEnded;
    }
}
