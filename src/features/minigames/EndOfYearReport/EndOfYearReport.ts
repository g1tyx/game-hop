import {MiniGameReport} from '../MiniGameReport';

export class EndOfYearReport {
    reports: MiniGameReport[];
    multiplier: number;
    moneyLeft: number;
    budgetMultiplier: number;

    constructor(multiplier: number, moneyLeft: number, budgetMultiplier: number) {
        this.reports = [];
        this.multiplier = multiplier;
        this.moneyLeft = moneyLeft;
        this.budgetMultiplier = budgetMultiplier;
    }

    addReport(report: MiniGameReport): void {
        this.reports.push(report);
    }

    getTotalReward(): number {
        let reward: number = 0;

        for (const report of this.reports) {
            reward += report.getReward();
        }

        reward += this.getCompletionBonus();

        return reward * this.multiplier * this.budgetMultiplier;
    }

    getSurplus(): number {
        return this.isCompleted() ? this.moneyLeft : 0;
    }

    getCompletionBonus(): number {
        return this.getSurplus() / 2;
    }


    isCompleted(): boolean {
        for (const report of this.reports) {
            if (!report.isCompleted()) {
                return false;
            }
        }
        return true;
    }

    print(): void {
        for (const report of this.reports) {
            report.print();
        }
        console.log(`Completion Bonus: ${this.getCompletionBonus()}`)
        console.log(`Multiplier: ${this.multiplier}`);
        console.log(`Budget Multiplier: ${this.budgetMultiplier}`);
        console.log(`Total: ${this.getTotalReward()}`);

    }

}
