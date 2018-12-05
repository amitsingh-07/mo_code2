import { QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

import { PlanWidgetComponent } from '../../shared/widgets/plan-widget/plan-widget.component';
import { IDropDownData } from '../../shared/widgets/settings-widget/settings-widget.component';
import { IProductCategory } from '../product-info/product-category/product-category';

export class DirectResultsState {
    isMobileView: boolean;
    planWidgets: QueryList<PlanWidgetComponent>;

    premiumFrequencyType;

    sortList: IDropDownData[] = [];

    pageTitle = '';
    isComparePlanEnabled = false;
    toggleBackdropVisibility = false;
    searchResult;
    filteredResult = [];
    selectedFilterList = [];

    isViewMode = false;
    selectedCategory: IProductCategory;
    selectedPlans: any[] = [];
    selectedComparePlans: any[] = [];
    filters = [];
    filterArgs;
    sortProperty = '';
    toolTips;
    resultsEmptyMessage = '';
    enquiryId;
    premiumFrequency: any = [{ value: 'monthly', name: 'Monthly', checked: true }, { value: 'yearly', name: 'Yearly', checked: false }];
    insurers: any = { All: 'All' };
    insurersFinancialRating: any = { All: 'All' };
    payoutYears: any = { All: 'All' };
    payoutPeriod: any = { All: 'All' };
    claimFeature: any = { All: 'All' };
    deferredPeriod: any = { All: 'All' };
    escalatingBenefit: any = { All: 'All' };
    fullPartialRider: any = { All: 'All' };
    claimCriteria: any = { All: 'All' };
    isResultsLoaded = false;

    filterTypes;
    filterModalData;
    totalProductCount: number;
}
