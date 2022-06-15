export class MiniGameReport {
    public description: string;
    public actual: number;
    public target: number;
    public basePrestigeReward: number;

    constructor(description: string, actual: number, target: number, basePrestigeReward: number) {
        this.description = description;
        this.actual = actual;
        this.target = target;
        this.basePrestigeReward = basePrestigeReward;
    }

    getReward(): number {
        return this.isCompleted() ? this.basePrestigeReward : 0.333 * this.getPercentage() * this.basePrestigeReward;
    }

    isCompleted(): boolean {
        return this.actual >= this.target;
    }

    getPercentage(): number {
        return this.actual / this.target;
    }

    print(): void {
        console.log(`${this.description} - ${this.actual}/${this.target}`);
    }
}
