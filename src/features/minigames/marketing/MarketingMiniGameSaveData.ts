import {MarketingCampaignSaveData} from "./MarketingCampaignSaveData";
import {UpgradeListSaveData} from "../../../engine/upgrades/UpgradeListSaveData";

export class MarketingMiniGameSaveData {

    fame: number
    upgrades: UpgradeListSaveData
    campaigns: MarketingCampaignSaveData[]


    constructor(fame: number, upgrades: UpgradeListSaveData, campaigns: MarketingCampaignSaveData[]) {
        this.fame = fame;
        this.upgrades = upgrades;
        this.campaigns = campaigns;
    }
}
