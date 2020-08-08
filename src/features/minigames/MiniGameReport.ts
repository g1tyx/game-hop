export class MiniGameReport {
    public description: string;
    public actual: number;
    public target: number;

    constructor(description: string, actual: number, target: number) {
        this.description = description;
        this.actual = actual;
        this.target = target;
    }

    getPercentage(): number {
        return this.actual / this.target;
    }

    print(): void {
        console.log(`${this.description} - ${this.actual}/${this.target}`);
    }
}
