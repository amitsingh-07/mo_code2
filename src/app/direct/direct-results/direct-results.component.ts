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
        this.filters.push(premiumFrequency);
        this.filters.push(insurers);
        this.filters.push(insurersFinancialRating);
        switch (this.selectedCategory.id - 1) {
          case 1:
            this.filters.push({ title: 'Claim Feature', toolTip: '', filterTypes: this.claimFeature, allBtn: true });
            break;
          case 2:
            //this.filters.delete(premiumFrequency);
            //this.filters.delete(insurersFinancialRating);
            this.filters.push({ title: 'Deferred Period', toolTip: '', filterTypes: this.deferredPeriod, allBtn: true });
            this.filters.push({ title: 'Escalating Benefit', toolTip: '', filterTypes: this.escalatingBenefit });
            break;
          case 3:
            //this.filters.delete(premiumFrequency);
            this.filters.push({ title: 'Full / Partial Rider', toolTip: '', filterTypes: this.fullPartialRider });
            break;
          case 4:
            this.filters.push({ title: 'Payout Years', filterTypes: this.payoutYears, allBtn: true });
            this.filters.push({ title: 'Claim Criteria', toolTip: '', filterTypes: this.claimCriteria, allBtn: true });
            break;
          case 5:
            //this.filters.delete(premiumFrequency);
            break;
          case 6:
            this.filters.push({ title: 'Payout Years', filterTypes: this.payoutYears, allBtn: true });
            break;
          case 7:
            //this.filters.delete(premiumFrequency);
            break;
        }
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
