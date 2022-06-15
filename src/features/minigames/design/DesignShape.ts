import {DesignShapeType} from "./DesignShapeType";
import {DesignColorType} from "./DesignColorType";
import {App} from "../../../App";

export class DesignShape {
    shape: DesignShapeType;
    color: DesignColorType;

    constructor(shape: DesignShapeType, color: DesignColorType) {
        this.shape = shape;
        this.color = color;
    }

    guess(): boolean {
        return App.game.miniGames.design.guess(this);
    }

    toString(): string {
        return `${this.color} ${this.shape}`;
    }
}
