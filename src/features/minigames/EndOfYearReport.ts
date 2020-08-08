import {MiniGameReport} from "./MiniGameReport";

export class EndOfYearReport {
    reports: MiniGameReport[];


    constructor(reports: MiniGameReport[]) {
        this.reports = reports;
    }

    addReport(report: MiniGameReport): void {
        this.reports.push(report);
    }

    print(): void {
        for (const report of this.reports) {
            report.print();
        }
    }

}
