import * as ko from "knockout";

import {MiniGame} from "../MiniGame";
import {MarketingMiniGameSaveData} from "./MarketingMiniGameSaveData";
import {MarketingFameRequirement} from "./MarketingFameRequirement";
import {MarketingCampaign} from "./MarketingCampaign";
import {Currency} from "../../wallet/Currency";
import {CurrencyType} from "../../wallet/CurrencyType";
import {App} from "../../../App";
import {ISimpleEvent, SimpleEventDispatcher} from "ste-simple-events";
import {ObservableArrayProxy} from "../../../engine/knockout/ObservableArrayProxy";
import {MiniGameUpgradeType} from "../MiniGameUpgradeType";
import {MiniGameUpgrade} from "../MiniGameUpgrade";
import {RandomHelper} from "../../../engine/util/RandomHelper";

export class MarketingMiniGame extends MiniGame {
    name: string = "Marketing";
    saveKey: string = "marketing";

    private _fame: ko.Observable<number>;
    availableCampaigns: ObservableArrayProxy<MarketingCampaign>;

    private readonly maxCampaigns: number = 4;

    private readonly _onCampaignCompletion = new SimpleEventDispatcher<MarketingCampaign>();


    constructor(budgetRequirement: number) {
        super(budgetRequirement);
        this._fame = ko.observable(0);
        this.yearRequirements = [];
        this.availableCampaigns = new ObservableArrayProxy<MarketingCampaign>([]);
    }

    initialize(): void {
        this.yearRequirements.push(new MarketingFameRequirement("Marketing - Gain fame", 1000, 200));

        this.upgrades.push(new MiniGameUpgrade('marketing-cost-1', "Campaigns are 25% cheaper", new Currency(100, CurrencyType.money), 0.90, MiniGameUpgradeType.MarketingCost));
        this.upgrades.push(new MiniGameUpgrade('marketing-fame-1', "Campaigns give 10% more fame", new Currency(50, CurrencyType.money), 0.90, MiniGameUpgradeType.MarketingFame));
        this.upgrades.push(new MiniGameUpgrade('marketing-speed-1', "Campaigns are 20% faster", new Currency(50, CurrencyType.money), 0.90, MiniGameUpgradeType.MarketingSpeed));
        this.upgrades.push(new MiniGameUpgrade('marketing-cost-2', "Campaigns are 35% cheaper", new Currency(300, CurrencyType.money), 0.80, MiniGameUpgradeType.MarketingCost));
        this.upgrades.push(new MiniGameUpgrade('marketing-fame-2', "Campaigns give 20 more fame", new Currency(100, CurrencyType.money), 0.80, MiniGameUpgradeType.MarketingFame));
        this.upgrades.push(new MiniGameUpgrade('marketing-speed-2', "Campaigns are 40% faster", new Currency(100, CurrencyType.money), 0.80, MiniGameUpgradeType.MarketingSpeed));
        App.game.yearTracker.onMonthStart.subscribe(() => this.spawnCampaign());
    }

    public getFameGainMultiplier(): number {
        return App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.MarketingFame) * this.getTotalMultiplierForType(MiniGameUpgradeType.MarketingFame);
    }

    public getCostMultiplier(): number {
        return App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.MarketingCost) * this.getTotalMultiplierForType(MiniGameUpgradeType.MarketingCost)
    }

    public getSpeedMultiplier(): number {
        return App.game.prestige.skillTree.getTotalMultiplierForType(MiniGameUpgradeType.MarketingSpeed) * this.getTotalMultiplierForType(MiniGameUpgradeType.MarketingSpeed)
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
            this.availableCampaigns.push(this.generateRandomCampaign())

        }
    }

    private generateRandomCampaign(): MarketingCampaign {
        const fameReward = RandomHelper.fuzzNumber(30 + RandomHelper.randomBetween(100, 300), 0.4);
        const cost = RandomHelper.fuzzNumber(fameReward / 2.5, 0.4);
        const monthsToComplete = RandomHelper.fuzzNumber(fameReward / 100, 0.8);
        return new MarketingCampaign("Flavour text", monthsToComplete, new Currency(cost, CurrencyType.money), fameReward)
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
