import { Pipe, PipeTransform } from '@angular/core';

export interface IFilterData {
    insurerName: Set<string>;
    financialRating: Set<string>;
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

                return insurerName && financialRating;
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
