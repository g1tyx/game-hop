import {DesignShapeType} from "./DesignShapeType";
import {DesignColorType} from "./DesignColorType";

export class DesignShape {
    shape: DesignShapeType;
    color: DesignColorType;

    constructor(shape: DesignShapeType, color: DesignColorType) {
        this.shape = shape;
        this.color = color;
    }
}
