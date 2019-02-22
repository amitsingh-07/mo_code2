import { Pipe, PipeTransform } from '@angular/core';

export interface IFilterData {
    insurerName: Set<string>;
    financialRating: Set<string>;
    premiumFrequency: Set<string>;
    claimFeature: Set<string>;
    deferredPeriod: Set<string>;
    escalatingBenefit: Set<string>;
    /*fullPartialRider: Set<string>;*/
    payoutYears: Set<string>;
    payoutPeriod: Set<string>;
    claimCriteria: Set<string>;
}

@Pipe({
    name: 'planFilter',
    pure: false
})
export class PlanFilterPipe implements PipeTransform {
    filterData: IFilterData;
    filteredList: any[];

    transform(plans: any[], filters: any): any {
        const args = arguments;

        if (filters) {

            this.filterData = filters;
            this.filteredList = plans.filter((plan) => {
                const isInsurerName = typeof (this.filterData.insurerName) === 'undefined'
                    || this.filterData.insurerName.size === 0;
                const insurerName = isInsurerName ? true
                    : this.filterData.insurerName.has(plan.insurer.insurerName);

                const isFinancialRating = typeof (this.filterData.financialRating) === 'undefined'
                    || this.filterData.financialRating.size === 0;
                const financialRating = isFinancialRating ? true
                    : this.filterData.financialRating.has(plan.insurer.rating);

                const isPremiumFrequency = typeof (this.filterData.premiumFrequency) === 'undefined'
                    || this.filterData.premiumFrequency.size === 0;
                const premiumFrequency = isPremiumFrequency ? true
                    : this.filterData.premiumFrequency.has(plan.premium.premiumFrequency);

                const isDeferredPeriod = typeof (this.filterData.deferredPeriod) === 'undefined'
                    || this.filterData.deferredPeriod.size === 0;
                const deferredPeriod = isDeferredPeriod ? true
                    : this.filterData.deferredPeriod.has(plan.premium.deferredPeriod);

                const isEscalatingBenefit = typeof (this.filterData.escalatingBenefit) === 'undefined'
                    || this.filterData.escalatingBenefit.size === 0;
                const escalatingBenefit = isEscalatingBenefit ? true
                    : this.filterData.escalatingBenefit.has(plan.premium.escalatingBenefit);

                /*const isFullPartialRider = typeof (this.filterData.fullPartialRider) === 'undefined'
                    || this.filterData.fullPartialRider.size === 0;
                const fullPartialRider = isFullPartialRider ? true
                    : this.filterData.fullPartialRider.has(plan.rider.riderName);*/

                const isPayoutYears = typeof (this.filterData.payoutYears) === 'undefined'
                    || this.filterData.payoutYears.size === 0;
                const payoutYears = isPayoutYears ? true
                    : this.filterData.payoutYears.has(plan.premium.payoutDuration);

                const isPayoutPeriod = typeof (this.filterData.payoutPeriod) === 'undefined'
                    || this.filterData.payoutPeriod.size === 0;
                const payoutPeriod = isPayoutPeriod ? true
                    : this.filterData.payoutPeriod.has(plan.premium.retirementPayPeriodDisplay);

                const isClaimFeature = typeof (this.filterData.claimFeature) === 'undefined'
                    || this.filterData.claimFeature.size === 0;
                const claimFeature = isClaimFeature ? true
                    : this.filterData.claimFeature.has(plan.premium.claimFeature);

                const isClaimCriteria = typeof (this.filterData.claimCriteria) === 'undefined'
                    || this.filterData.claimCriteria.size === 0;
                const claimCriteria = isClaimCriteria ? true
                    : this.filterData.claimCriteria.has(plan.premium.claimCriteria);

                return insurerName && financialRating && premiumFrequency && claimFeature &&
                    deferredPeriod && escalatingBenefit && payoutYears && claimCriteria && payoutPeriod;
            });
        } else {
            this.filteredList = plans;
        }

        const filterredCountSubj = args[2];
        if (filterredCountSubj) {
            filterredCountSubj.next(this.filteredList);
        }

        return this.filteredList;
    }
}
