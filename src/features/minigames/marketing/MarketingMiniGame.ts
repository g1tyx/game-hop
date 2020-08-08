import * as ko from "knockout";

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
import {ObservableArrayProxy} from "../../../engine/knockout/ObservableArrayProxy";
import {MiniGameRequirement} from "../MiniGameRequirement";

export class MarketingMiniGame extends Feature implements MiniGame {
    name: string = "Marketing";
    saveKey: string = "marketing";
    yearRequirements: MiniGameRequirement[];

    private _fame: ko.Observable<number>;
    availableCampaigns: ObservableArrayProxy<MarketingCampaign>;

    private readonly maxCampaigns: number = 4;

    private readonly _onCampaignCompletion = new SimpleEventDispatcher<MarketingCampaign>();


    constructor() {
        super();
        this._fame = ko.observable(0);
        this.yearRequirements = [];
        this.availableCampaigns = new ObservableArrayProxy<MarketingCampaign>([]);
    }

    initialize(): void {
        this.yearRequirements.push(new MarketingFameRequirement("Marketing fame", 1000));

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
        if (this.availableCampaigns.length < this.maxCampaigns) {
            this.availableCampaigns.push(new MarketingCampaign("Flavour text", 0.5, new Currency(100, CurrencyType.money), 100))

        }
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
        while (this.availableCampaigns.length > 0) {
            this.availableCampaigns.pop();
        }
    }

    load(data: MarketingMiniGameSaveData): void {
    }

    parseSaveData(json: Record<string, unknown>): MarketingMiniGameSaveData {
        return undefined;
    }

    save(): MarketingMiniGameSaveData {
        return undefined;
    }

    // Knockout getters/setters
    get fame(): number {
        return this._fame();
    }

    set fame(value: number) {
        this._fame(value);
    }

    // Event getters/setters
    public get onCampaignCompletion(): ISimpleEvent<MarketingCampaign> {
        return this._onCampaignCompletion.asEvent();
    }


}
