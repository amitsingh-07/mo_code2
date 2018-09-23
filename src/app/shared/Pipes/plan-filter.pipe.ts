import { Pipe, PipeTransform } from '@angular/core';

export interface IFilterData {
    insurerName: Set<string>;
    financialRating: Set<string>;
    premiumFrequency: Set<string>;
    claimFeature: Set<string>;
    deferredPeriod: Set<string>;
    escalatingBenefit: Set<string>;
    fullPartialRider: Set<string>;
    payoutYears: Set<string>;
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
                const insurerName = (typeof (this.filterData.insurerName) === 'undefined' ? true
                    : this.filterData.insurerName.has(plan.insurer.insurerName));

                const financialRating = (typeof (this.filterData.financialRating) === 'undefined' ? true
                    : this.filterData.financialRating.has(plan.insurer.rating));

                const premiumFrequency = (typeof (this.filterData.premiumFrequency) === 'undefined' ? true
                    : this.filterData.premiumFrequency.has(plan.premium.premiumFrequency));

                const claimFeature = (typeof (this.filterData.claimFeature) === 'undefined' ? true
                    : this.filterData.claimFeature.has(plan.insurer.rating));

                const deferredPeriod = (typeof (this.filterData.deferredPeriod) === 'undefined' ? true
                    : this.filterData.deferredPeriod.has(plan.insurer.rating));

                const escalatingBenefit = (typeof (this.filterData.escalatingBenefit) === 'undefined' ? true
                    : this.filterData.escalatingBenefit.has(plan.insurer.rating));

                const fullPartialRider = (typeof (this.filterData.fullPartialRider) === 'undefined' ? true
                    : this.filterData.fullPartialRider.has(plan.insurer.rating));

                const payoutYears = (typeof (this.filterData.payoutYears) === 'undefined' ? true
                    : this.filterData.payoutYears.has(plan.insurer.rating));

                const claimCriteria = (typeof (this.filterData.claimCriteria) === 'undefined' ? true
                    : this.filterData.claimCriteria.has(plan.insurer.rating));

                return insurerName && financialRating && premiumFrequency && claimFeature &&
                deferredPeriod && escalatingBenefit && fullPartialRider && payoutYears && claimCriteria;
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
