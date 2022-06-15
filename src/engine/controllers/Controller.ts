export abstract class Controller {
    key: string;

    protected constructor(key: string) {
        this.key = key;
    }

    abstract initialize(): void;
}
