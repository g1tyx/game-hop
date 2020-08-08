import {MiniGame} from "../MiniGame";
import {Feature} from "../../../engine/Feature";
import {Requirement} from "../../../engine/requirements/Requirement";
import {MarketingMiniGameSaveData} from "./MarketingMiniGameSaveData";
import {MarketingFameRequirement} from "./MarketingFameRequirement";
import {MarketingCampaign} from "./MarketingCampaign";
import {Currency} from "../../wallet/Currency";
import {CurrencyType} from "../../wallet/CurrencyType";
import {App} from "../../../App";
import {ISimpleEvent, SimpleEventDispatcher} from "ste-simple-events";

export class MarketingMiniGame extends Feature implements MiniGame {
    name: string = "Marketing";
    saveKey: string = "marketing";
    yearRequirements: Requirement[];

    fame: number;
    availableCampaigns: MarketingCampaign[];

    private readonly _onCampaignCompletion = new SimpleEventDispatcher<MarketingCampaign>();


    constructor() {
        super();
        this.yearRequirements = [];
        this.availableCampaigns = [];
    }

    initialize(): void {
        this.yearRequirements.push(new MarketingFameRequirement(1000));

        App.game.yearTracker.onMonthStart.subscribe(() => this.spawnCampaign());
    }

    /**
     * Start the campaign, returns if this was successful
     */
    startCampaign(index: number): boolean {
        if (this.availableCampaigns[index] == null) {
            console.warn(`Could not start campaign with index ${index}`);
            return false;
        }
        return this.availableCampaigns[index].tryToStart();
    }

    removeCampaign(campaign: MarketingCampaign): void {
        const index = this.availableCampaigns.indexOf(campaign, 0);
        if (index > -1) {
            this.availableCampaigns.splice(index, 1);
        }
    }

    spawnCampaign(): void {
        this.availableCampaigns.push(new MarketingCampaign(0.5, new Currency(100, CurrencyType.money), 100))
    }

    update(delta: number): void {
        for (const campaign of this.availableCampaigns) {
            if (campaign.isStarted) {
                campaign.completionProgress += App.game.yearTracker.secondsToMonthPercentage(delta);

                if (campaign.isCompleted()) {
                    this.complete(campaign);
                }
            }
        }
    }

    complete(campaign: MarketingCampaign): void {
        this.fame += campaign.fameReward;
        this._onCampaignCompletion.dispatch(campaign);
        this.removeCampaign(campaign);

    }


    reset(): void {
        this.fame = 0;
        this.availableCampaigns = [];
    }

    load(data: MarketingMiniGameSaveData): void {
    }

    parseSaveData(json: Record<string, unknown>): MarketingMiniGameSaveData {
        return undefined;
    }

    save(): MarketingMiniGameSaveData {
        return undefined;
    }


    // Event getters/setters
    public get onCampaignCompletion(): ISimpleEvent<MarketingCampaign> {
        return this._onCampaignCompletion.asEvent();
    }


}
