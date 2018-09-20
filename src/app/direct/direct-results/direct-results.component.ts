import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { IProductCategory } from '../product-info/product-category/product-category';
import { HeaderService } from './../../shared/header/header.service';
import { DIRECT_ROUTE_PATHS } from './../direct-routes.constants';
import { DirectApiService } from './../direct.api.service';
import { DirectService } from './../direct.service';

@Component({
  selector: 'app-direct-results',
  templateUrl: './direct-results.component.html',
  styleUrls: ['./direct-results.component.scss']
})
export class DirectResultsComponent implements IPageComponent, OnInit {

  pageTitle = '';
  isComparePlanEnabled = true;
  toggleBackdropVisibility = false;
  searchResult;

  selectedCategory: IProductCategory;
  selectedPlans: any[] = [];
  filters = new Set();
  filterArgs;
  premiumFrequency = new Set();
  insurers = new Set([{ value: 'All', checked: true}]);
  insurersFinancialRating = new Set([{ value: 'All', checked: true}]);
  claimFeature = new Set(['All', 'Single Claim', 'Multiple Claim']);
  deferredPeriod = new Set(['All', '3 Months', '6 Months']);
  escalatingBenefit = new Set(['All', '0%', '3%']);
  fullPartialRider = new Set(['All', 'Partial Rider', 'Full Rider']);
  payoutYears = new Set(['All', '12 Years', 'Lifetime']);
  claimCriteria = new Set(['All', 'Standard', 'Lenient']);

  constructor(
    private directService: DirectService, private directApiService: DirectApiService,
    private router: Router, private translate: TranslateService, public headerService: HeaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESULTS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.selectedCategory = this.directService.getProductCategory();
    this.directApiService.getSearchResults(this.directService.getProductCategory())
      .subscribe((data) => {
        this.searchResult = data.objectList[0].productProtectionTypeList;
        for (const productLists of data.objectList[0].productProtectionTypeList) {
          for (const productList of productLists.productList) {
            this.insurers.add({ value: productList.insurer.insurerName, checked: false});
            this.insurersFinancialRating.add({ value: productList.insurer.rating, checked: false});
            this.premiumFrequency.add({ value: productList.premium.premiumFrequency, checked: false});
          }
        }
        const premiumFrequency = {
          title: 'Premium Frequency', name: 'premium.premiumFrequency', values: this.premiumFrequency, all: false};
        const insurers = { title: 'Insurers', name: 'insurer.insurerName', values: this.insurers, all: true};
        const insurersFinancialRating = {
          title: 'Insurers\' Financial Rating', name: 'insurer.rating',
          values: this.insurersFinancialRating, all: true};
        this.filters.add(premiumFrequency);
        this.filters.add(insurers);
        this.filters.add(insurersFinancialRating);
        switch (this.selectedCategory.id - 1) {
          case 1:
            this.filters.add({title: 'Claim Feature', toolTip: '', values: this.claimFeature});
            break;
          case 2:
            this.filters.delete(premiumFrequency);
            this.filters.delete(insurersFinancialRating);
            this.filters.add({title: 'Deferred Period', toolTip: '', values: this.deferredPeriod});
            this.filters.add({title: 'Escalating Benefit', toolTip: '', values: this.escalatingBenefit});
            break;
          case 3:
            this.filters.delete(premiumFrequency);
            this.filters.add({title: 'Full / Partial Rider', toolTip: '', values: this.fullPartialRider});
            break;
          case 4:
            this.filters.add({title: 'Payout Years', values: this.payoutYears});
            this.filters.add({title: 'Claim Criteria', toolTip: '', values: this.claimCriteria});
            break;
          case 5:
            this.filters.delete(premiumFrequency);
            break;
          case 6:
            this.filters.add({title: 'Payout Years', values: this.payoutYears});
            break;
          case 7:
            this.filters.delete(premiumFrequency);
            break;
        }
      });
  }

  ngOnInit() {
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  editProdInfo() {

  }

  viewDetails(plan) {
  }

  selectPlan(data) {
    const index: number = this.selectedPlans.indexOf(data.plan);
    if (data.selected) {
      if (index === -1) {
        this.selectedPlans.push(data.plan);
      }
    } else {
      if (index !== -1) {
        this.selectedPlans.splice(index, 1);
      }
    }
  }

  comparePlan(data) {
    if (data.selected) {
      this.selectedPlans.push(data.plan);
    } else {
      const index: number = this.selectedPlans.indexOf(data.plan);
      if (index !== -1) {
        this.selectedPlans.splice(index, 1);
      }
    }
  }

  compare() {
    this.directService.setSelectedPlans(this.selectedPlans);
    this.router.navigate([DIRECT_ROUTE_PATHS.COMPARE_PLANS]);
  }

  enableComparePlan() {
    this.isComparePlanEnabled = !this.isComparePlanEnabled;
  }

  filterProducts(filterLists) {
    this.filterArgs = filterLists;
  }
}
