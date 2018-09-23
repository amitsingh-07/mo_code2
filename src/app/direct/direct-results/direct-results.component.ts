import { ChangeDetectionStrategy, Component, OnInit, ViewChildren, DoCheck, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { OrderByPipe } from '../../shared/Pipes/order-by.pipe';
import { IDropDownData } from '../../shared/widgets/settings-widget/settings-widget.component';
import { IProductCategory } from '../product-info/product-category/product-category';
import { HeaderService } from './../../shared/header/header.service';
import { DIRECT_ROUTE_PATHS } from './../direct-routes.constants';
import { DirectApiService } from './../direct.api.service';
import { DirectService } from './../direct.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-direct-results',
  templateUrl: './direct-results.component.html',
  styleUrls: ['./direct-results.component.scss']
})
export class DirectResultsComponent implements IPageComponent, OnInit, AfterContentInit {

  sortList: IDropDownData[] = [
    { displayText: 'Highest Ranking', value: 'premium.ranking' },
    { displayText: 'Insurer Name (A-Z)', value: '+insurer.insurerName' },
    { displayText: 'Insurer Name (Z-A)', value: '-insurer.insurerName' },
    { displayText: 'Financial Rating (Highest-Lowest)', value: '+insurer.rating' },
    { displayText: 'Financial Rating (Lowest-Highest)', value: '-insurer.rating' },
  ];

  pageTitle = '';
  isComparePlanEnabled = true;
  toggleBackdropVisibility = false;
  searchResult;
  filteredResult;
  filteredCountSubject = new Subject<number>();
  subscription: Subscription;

  selectedCategory: IProductCategory;
  selectedPlans: any[] = [];
  filters = [];
  filterArgs;
  sortProperty = this.sortList[0].value;

  premiumFrequency: any = {};
  insurers: any = { All: 'All' };
  insurersFinancialRating: any = { All: 'All' };
  claimFeature = [{value: 'All', checked: true}, { value: 'Single Claim', checked: false}, { value: 'Multiple Claim', checked: false}];
  deferredPeriod = [{value: 'All', checked: true}, { value: '3 Months', checked: false}, { value: '6 Months', checked: false}];
  escalatingBenefit = [{value: 'All', checked: true}, { value: '0%', checked: false}, { value: '3%', checked: false}];
  fullPartialRider = [{value: 'All', checked: true}, { value: 'Partial Rider', checked: false}, { value: 'Full Rider', checked: false}];
  payoutYears = [{value: 'All', checked: true}, { value: '12 Years', checked: false}, { value: 'Lifetime', checked: false}];
  claimCriteria = [{value: 'All', checked: true}, { value: 'Standard', checked: false}, { value: 'Lenient', checked: false}];

  constructor(
    private directService: DirectService, private directApiService: DirectApiService,
    private router: Router, private translate: TranslateService, public headerService: HeaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESULTS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.subscription = this.filteredCountSubject.subscribe((planList) => {
      this.filteredResult = planList;
    });
    this.selectedCategory = this.directService.getProductCategory();
    this.directApiService.getSearchResults(this.directService.getProductCategory())
      .subscribe((data) => {
        this.searchResult = data.objectList[0].productProtectionTypeList;
        this.filteredResult = this.searchResult;
        for (const productLists of data.objectList[0].productProtectionTypeList) {
          for (const productList of productLists.productList) {
            this.insurers[productList.insurer.insurerName.replace(/ /g, '_')] = productList.insurer.insurerName;
            this.insurersFinancialRating[productList.insurer.rating.replace(/ /g, '_')] = productList.insurer.rating;
            this.premiumFrequency[productList.premium.premiumFrequency.replace(/ /g, '_')] = productList.premium.premiumFrequency;
          }
        }
        this.insurers = Object.values(this.insurers).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.insurersFinancialRating = Object.values(this.insurersFinancialRating).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.premiumFrequency = Object.values(this.premiumFrequency).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        const premiumFrequency = {
          title: 'Premium Frequency', name: 'premiumFrequency', filterTypes: this.premiumFrequency, allBtn: false
        };
        const insurers = { title: 'Insurers', name: 'insurerName', filterTypes: this.insurers, allBtn: true };
        const insurersFinancialRating = {
          title: 'Insurers\' Financial Rating', name: 'financialRating',
          filterTypes: this.insurersFinancialRating, allBtn: true
        };
        const claimFeature = {
          title: 'Claim Feature', toolTip: '', name: 'claimFeature',
          filterTypes: this.claimFeature, allBtn: true
        };
        const deferredPeriod = {
          title: 'Deferred Period', toolTip: '', name: 'deferredPeriod',
          filterTypes: this.deferredPeriod, allBtn: true
        };
        const escalatingBenefit = {
          title: 'Escalating Benefit', toolTip: '', name: 'escalatingBenefit',
          filterTypes: this.escalatingBenefit, allBtn: true
        };
        const fullPartialRider = {
          title: 'Full / Partial Rider', toolTip: '', name: 'fullPartialRider',
          filterTypes: this.fullPartialRider, allBtn: true
        };
        const payoutYears = {
          title: 'Payout Years', toolTip: '', name: 'payoutYears',
          filterTypes: this.payoutYears, allBtn: true
        };
        const claimCriteria = {
          title: 'Claim Criteria', toolTip: '', name: 'claimCriteria',
          filterTypes: this.claimCriteria, allBtn: true
        };
        this.filters.push(premiumFrequency);
        this.filters.push(insurers);
        this.filters.push(insurersFinancialRating);
        switch (this.selectedCategory.id - 1) {
          case 1:
            this.filters.push({ title: 'Claim Feature', toolTip: '', filterTypes: this.claimFeature, allBtn: true });
            break;
          case 2:
            delete this.filters[1];
            delete this.filters[2];
            this.filters.push(deferredPeriod);
            this.filters.push(escalatingBenefit);
            break;
          case 3:
            delete this.filters[0];
            this.filters.push(fullPartialRider);
            break;
          case 4:
            this.filters.push(payoutYears);
            this.filters.push(claimCriteria);
            break;
          case 5:
            delete this.filters[0];
            break;
          case 6:
            this.filters.push(payoutYears);
            break;
          case 7:
            delete this.filters[0];
            break;
        }
        this.filters = this.filters.filter(() => true);
      });
  }

  ngAfterContentInit() {

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

  filterProducts(data: any) {
    this.filterArgs = data.filters;
    this.sortProperty = data.sortProperty;
  }
}
