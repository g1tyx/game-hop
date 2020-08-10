export class RandomHelper {

    /**
     * Return a value between (1-fuzzFactor)*number and (1 + fuzzFactor)*number
     * @param number
     * @param fuzzFactor
     */
    static fuzzNumber(number: number, fuzzFactor: number): number {
        if (fuzzFactor < 0 || fuzzFactor > 1) {
            console.error(`Cannot fuzz number ${number} with factor ${fuzzFactor}`);
            return number;
        }
        return number * this.randomBetween(1 - fuzzFactor, 1 + fuzzFactor);
    }

    /**
     * Return a random number between min (included) and max (excluded)
     */
    static randomBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }


}
