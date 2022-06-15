import {SaveData} from "../../engine/saving/SaveData";

export class WalletSaveData extends SaveData {
    money: number;
    prestige: number;


    constructor(money: number, prestige: number) {
        super();
        this.money = money;
        this.prestige = prestige;
    }
}
