export class UpgradeListSaveData {
    upgradeKeys: string[]

    constructor() {
        this.upgradeKeys = [];
    }

    addUpgrade(key: string): void {
        this.upgradeKeys.push(key);
    }
}
