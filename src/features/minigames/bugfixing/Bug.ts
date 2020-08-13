import * as ko from "knockout";

export class Bug {
    private readonly _position: ko.Observable<number>;
    lane: number;

    constructor(position: number, lane: number) {
        this._position = ko.observable(position);
        this.lane = lane;
    }

    toString(): string {
        return `${this.lane}: ${this.position.toFixed(2)}`;
    }


    get position(): number {
        return this._position();
    }

    set position(value: number) {
        this._position(value);
    }
}
