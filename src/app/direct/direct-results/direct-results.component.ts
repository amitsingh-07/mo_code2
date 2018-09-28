import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { IDropDownData } from '../../shared/widgets/settings-widget/settings-widget.component';
import { IProductCategory } from '../product-info/product-category/product-category';
import { HeaderService } from './../../shared/header/header.service';
import { Formatter } from './../../shared/utils/formatter.util';
import { SettingsWidgetComponent } from './../../shared/widgets/settings-widget/settings-widget.component';
import { DIRECT_ROUTE_PATHS } from './../direct-routes.constants';
import { DirectApiService } from './../direct.api.service';
import { DirectService } from './../direct.service';

const settingsHeaderIcon = 'navbar__helpIcon--mobile-settings';

@Component({
  selector: 'app-direct-results',
  templateUrl: './direct-results.component.html',
  styleUrls: ['./direct-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DirectResultsComponent implements IPageComponent, OnInit {

  @Input() isMobileView: boolean;

  sortList: IDropDownData[] = [];

  pageTitle = '';
  isComparePlanEnabled = false;
  toggleBackdropVisibility = false;
  searchResult = [];
  filteredResult = [];
  filteredCountSubject = new Subject<any>();
  selectedFilterList = [];
  subscription: Subscription;

  selectedCategory: IProductCategory;
  selectedPlans: any[] = [];
  filters = [];
  filterArgs;
  sortProperty;
  types;
  toolTips;
  resultsEmptyMessage = '';

  premiumFrequency: any = [{ value: 'per month', name: 'Monthly', checked: true }, { value: 'per year', name: 'Yearly', checked: false }];
  insurers: any = { All: 'All' };
  insurersFinancialRating: any = { All: 'All' };
  payoutYears: any = { All: 'All' };
  claimFeature: any = { All: 'All' };
  deferredPeriod: any = { All: 'All' };
  escalatingBenefit: any = { All: 'All' };
  fullPartialRider: any = { All: 'All' };
  claimCriteria: any = { All: 'All' };

  constructor(
    private directService: DirectService, private directApiService: DirectApiService,
    private router: Router, private translate: TranslateService, public headerService: HeaderService,
    public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESULTS.TITLE');
      this.sortList = this.translate.instant('SETTINGS.SORT');
      this.types = this.translate.instant('SETTINGS.TYPES');
      this.resultsEmptyMessage = this.translate.instant('SETTINGS.NO_RESULTS');
      this.sortProperty = this.sortList[0].value;
      this.setPageTitle(this.pageTitle);
      this.toolTips = this.translate.instant('FILTER_TOOLTIPS');
      this.getRecommendations();
    });
    this.subscription = this.filteredCountSubject.subscribe((planList) => {
      this.filteredResult = planList;
    });
  }

  ngOnInit() {
    this.subscription = this.headerService.currentMobileModalEvent.subscribe((event) => {
      if (event === this.pageTitle) {
        this.showSettingsPopUp();
      }
    });
  }

  getRecommendations() {
    this.selectedCategory = this.directService.getProductCategory();
    this.directApiService.getSearchResults(this.directService.getProductCategory())
      .subscribe((data) => {
        if (data.responseMessage.responseCode === 6004) {
          this.resultsEmptyMessage = data.responseMessage.responseDescription;
          return;
        }

        this.searchResult = data.objectList[0].productProtectionTypeList;
        this.filteredResult = this.searchResult;
        for (const productLists of data.objectList[0].productProtectionTypeList) {
          for (const productList of productLists.productList) {
            if (productList.insurer && productList.insurer.insurerName) {
              this.insurers[Formatter.createObjectKey(productList.insurer.insurerName)] = productList.insurer.insurerName;
            }
            if (productList.insurer && productList.insurer.rating) {
              this.insurersFinancialRating[Formatter.createObjectKey(productList.insurer.rating)] = productList.insurer.rating;
            }
            if (productList.premium && productList.premium.payoutAge) {
              this.payoutYears[Formatter.createObjectKey(productList.premium.payoutAge)] = productList.premium.payoutAge;
            }
            if (productList.premium && productList.premium.deferredPeriod) {
              this.deferredPeriod[Formatter.createObjectKey(productList.premium.deferredPeriod)] = productList.premium.deferredPeriod;
            }
            if (productList.premium && productList.premium.escalatingBenefit) {
              this.escalatingBenefit[Formatter.createObjectKey(productList.premium.escalatingBenefit)] =
                productList.premium.escalatingBenefit;
            }
            if (productList.rider && productList.rider.riderName) {
              this.fullPartialRider[Formatter.createObjectKey(productList.rider.riderName)] = productList.rider.riderName;
            }
            if (productList.insurer && productList.insurer.insurerName) {
              this.claimFeature[Formatter.createObjectKey(productList.insurer.insurerName)] = productList.insurer.insurerName;
            }
            if (productList.insurer && productList.insurer.insurerName) {
              this.claimCriteria[Formatter.createObjectKey(productList.insurer.insurerName)] = productList.insurer.insurerName;
            }
          }
        }
        this.insurers = Object.values(this.insurers).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.insurersFinancialRating = Object.values(this.insurersFinancialRating).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.payoutYears = Object.values(this.payoutYears).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.claimFeature = Object.values(this.claimFeature).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.deferredPeriod = Object.values(this.deferredPeriod).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.escalatingBenefit = Object.values(this.escalatingBenefit).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.fullPartialRider = Object.values(this.fullPartialRider).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });
        this.claimCriteria = Object.values(this.claimCriteria).map((key) => {
          return { value: key, checked: key === 'All' ? true : false };
        });

        const premiumFrequency = {
          title: this.types.PREMIUM_FREQUENCY, name: 'premiumFrequency',
          filterTypes: this.premiumFrequency, allBtn: false
        };
        const insurers = {
          title: this.types.INSURERS, name: 'insurerName',
          filterTypes: this.insurers, allBtn: true
        };
        const insurersFinancialRating = {
          title: this.types.INSURANCE_FINANCIAL_RATING, name: 'financialRating',
          filterTypes: this.insurersFinancialRating, allBtn: true
        };
        const claimFeature = {
          title: this.types.CLAIM_FEATURE, toolTip: { title: this.types.CLAIM_FEATURE, message: this.toolTips.CLIAM_FEATURE },
          name: 'claimFeature',
          filterTypes: this.claimFeature, allBtn: true
        };
        const deferredPeriod = {
          title: this.types.DEFERRED_PERIOD, toolTip: { title: this.types.DEFERRED_PERIOD, message: this.toolTips.DEFERRED_PERIOD },
          name: 'deferredPeriod',
          filterTypes: this.deferredPeriod, allBtn: true
        };
        const escalatingBenefit = {
          title: this.types.ESCALATING_BENEFIT,
          toolTip: { title: this.types.ESCALATING_BENEFIT, message: this.toolTips.ESCALATING_BENEFIT },
          name: 'escalatingBenefit',
          filterTypes: this.escalatingBenefit, allBtn: true
        };
        const fullPartialRider = {
          title: this.types.FULL_PARTIAL_RIDER,
          toolTip: { title: this.types.FULL_PARTIAL_RIDER, message: this.toolTips.FULL_PARTIAL_RIDER },
          name: 'fullPartialRider',
          filterTypes: this.fullPartialRider, allBtn: true
        };
        const payoutYears = {
          title: this.types.PAYOUT_YEARS, name: 'payoutYears',
          filterTypes: this.payoutYears, allBtn: true
        };
        const claimCriteria = {
          title: this.types.CLAIM_CRITERIA, toolTip: { title: this.types.CLAIM_CRITERIA, message: this.toolTips.CLAIM_CRITERIA },
          name: 'claimCriteria',
          filterTypes: this.claimCriteria, allBtn: true
        };

        this.filters.push(premiumFrequency);
        this.filters.push(insurers);
        this.filters.push(insurersFinancialRating);
        switch (this.selectedCategory.id - 1) {
          case 1:
            this.filters.push(claimFeature);
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

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title, null, false, true);
  }

  showSettingsPopUp() {
    const ref = this.modal.open(SettingsWidgetComponent, {
      centered: true,
      windowClass: 'help-modal-dialog'
    });
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.filters = this.filters;
    ref.componentInstance.sort = this.sortList;
    ref.componentInstance.isMobile = true;
    ref.componentInstance.selectedFilterList = this.selectedFilterList;
    ref.componentInstance.filterProducts.subscribe((data) => {
      this.filterProducts(data);
      ref.dismiss();
    });
    this.headerService.showMobilePopUp('removeClicked');
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

  showMobileMaxSelection() {

  }

  showWebMaxSelection() {

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

  toggleComparePlans() {
    this.isComparePlanEnabled = !this.isComparePlanEnabled;
  }

  filterProducts(data: any) {
    this.filterArgs = this.selectedFilterList = data.filters;
    this.sortProperty = data.sortProperty;
  }
}
