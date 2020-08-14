export class MarketingCampaignSaveData {
    description: string;
    months: number;
    cost: number;
    fame: number;


    constructor(description: string, months: number, cost: number, fame: number) {
        this.description = description;
        this.months = months;
        this.cost = cost;
        this.fame = fame;
    }
}
