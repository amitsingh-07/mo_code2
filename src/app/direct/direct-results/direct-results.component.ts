import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { IDropDownData } from '../../shared/widgets/settings-widget/settings-widget.component';
import { IProductCategory } from '../product-info/product-category/product-category';
import { MobileModalComponent } from './../../guide-me/mobile-modal/mobile-modal.component';
import {
  CreateAccountModelComponent
} from './../../guide-me/recommendations/create-account-model/create-account-model.component';
import { HeaderService } from './../../shared/header/header.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { ToolTipModalComponent } from './../../shared/modal/tooltip-modal/tooltip-modal.component';
import { SelectedPlansService } from './../../shared/Services/selected-plans.service';
import { Formatter } from './../../shared/utils/formatter.util';
import { PlanWidgetComponent } from './../../shared/widgets/plan-widget/plan-widget.component';
import { SettingsWidgetComponent } from './../../shared/widgets/settings-widget/settings-widget.component';
import { DIRECT_ROUTE_PATHS } from './../direct-routes.constants';
import { DirectApiService } from './../direct.api.service';
import { DirectService } from './../direct.service';

const mobileThreshold = 567;

@Component({
  selector: 'app-direct-results',
  templateUrl: './direct-results.component.html',
  styleUrls: ['./direct-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DirectResultsComponent implements IPageComponent, OnInit, OnDestroy {

  @Input() isMobileView: boolean;
  @ViewChildren('planWidget') planWidgets: QueryList<PlanWidgetComponent>;

  sortList: IDropDownData[] = [];

  pageTitle = '';
  isComparePlanEnabled = false;
  toggleBackdropVisibility = false;
  searchResult;
  filteredResult = [];
  filteredCountSubject = new Subject<any>();
  selectedFilterList = [];
  subscription: Subscription;
  filterCountSubscription: Subscription;

  selectedCategory: IProductCategory;
  selectedPlans: any[] = [];
  selectedComparePlans: any[] = [];
  filters = [];
  filterArgs;
  sortProperty;
  toolTips;
  resultsEmptyMessage = '';
  enquiryId;
  premiumFrequency: any = [{ value: 'per month', name: 'Monthly', checked: true }, { value: 'per year', name: 'Yearly', checked: false }];
  insurers: any = { All: 'All' };
  insurersFinancialRating: any = { All: 'All' };
  payoutYears: any = { All: 'All' };
  claimFeature: any = { All: 'All' };
  deferredPeriod: any = { All: 'All' };
  escalatingBenefit: any = { All: 'All' };
  fullPartialRider: any = { All: 'All' };
  claimCriteria: any = { All: 'All' };

  filterTypes;
  filterModalData;
  totalProductCount: number;

  constructor(
    private directService: DirectService, private directApiService: DirectApiService,
    private router: Router, private translate: TranslateService, public headerService: HeaderService,
    public modal: NgbModal, private selectedPlansService: SelectedPlansService,
    private authService: AuthenticationService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESULTS.TITLE');
      this.sortList = this.translate.instant('SETTINGS.SORT');
      this.filterTypes = this.translate.instant('SETTINGS.TYPES');
      this.sortProperty = this.sortList[0].value;
      this.setPageTitle(this.pageTitle);
      this.toolTips = this.translate.instant('FILTER_TOOLTIPS');

      this.filterTypes = this.translate.instant('SETTINGS.TYPES');
      this.filterModalData = this.translate.instant('FILTER_TOOLTIPS.CLAIM_CRITERIA');

      if (this.authService.isAuthenticated()) {
        this.getRecommendations();
      } else {
        this.authService.authenticate().subscribe((token) => {
          this.getRecommendations();
        });
      }
    });
    this.filterCountSubscription = this.filteredCountSubject.subscribe((planList) => {
      this.filteredResult = planList;
    });
  }

  ngOnInit() {
    this.subscription = this.headerService.currentMobileModalEvent.subscribe((event) => {
      if (event === this.pageTitle) {
        this.showSettingsPopUp();
      }
    });
    if (window.innerWidth < mobileThreshold) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.filterCountSubscription.unsubscribe();
  }

  getRecommendations() {
    this.selectedCategory = this.directService.getProductCategory();
    this.directApiService.getSearchResults(this.directService.getProductCategory())
      .subscribe(
        (data) => {
          this.handleResponse(data);
        },
        (error) => {
          this.resultsEmptyMessage = 'An error occurred. Please try again.';
        });

    window.scroll(0, 0);
  }

  // tslint:disable-next-line:cognitive-complexity
  handleResponse(data) {
    if (data.responseMessage.responseCode === 6004) {
      this.resultsEmptyMessage = data.responseMessage.responseDescription;
      return;
    }

    this.resultsEmptyMessage = '';
    this.enquiryId = data.objectList[0].enquiryId;
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
      title: this.filterTypes.PREMIUM_FREQUENCY, name: 'premiumFrequency',
      filterTypes: this.premiumFrequency, allBtn: false
    };
    const insurers = {
      title: this.filterTypes.INSURERS, name: 'insurerName',
      filterTypes: this.insurers, allBtn: true
    };
    const insurersFinancialRating = {
      title: this.filterTypes.INSURANCE_FINANCIAL_RATING, name: 'financialRating',
      filterTypes: this.insurersFinancialRating, allBtn: true
    };
    const claimFeature = {
      title: this.filterTypes.CLAIM_FEATURE, toolTip: { title: this.filterTypes.CLAIM_FEATURE, message: this.toolTips.CLIAM_FEATURE },
      name: 'claimFeature',
      filterTypes: this.claimFeature, allBtn: true
    };
    const deferredPeriod = {
      title: this.filterTypes.DEFERRED_PERIOD, toolTip:
        { title: this.filterTypes.DEFERRED_PERIOD, message: this.toolTips.DEFERRED_PERIOD },
      name: 'deferredPeriod',
      filterTypes: this.deferredPeriod, allBtn: true
    };
    const escalatingBenefit = {
      title: this.filterTypes.ESCALATING_BENEFIT,
      toolTip: { title: this.filterTypes.ESCALATING_BENEFIT, message: this.toolTips.ESCALATING_BENEFIT },
      name: 'escalatingBenefit',
      filterTypes: this.escalatingBenefit, allBtn: true
    };
    const fullPartialRider = {
      title: this.filterTypes.FULL_PARTIAL_RIDER,
      toolTip: { title: this.filterTypes.FULL_PARTIAL_RIDER, message: this.toolTips.FULL_PARTIAL_RIDER },
      name: 'fullPartialRider',
      filterTypes: this.fullPartialRider, allBtn: true
    };
    const payoutYears = {
      title: this.filterTypes.PAYOUT_YEARS, name: 'payoutYears',
      filterTypes: this.payoutYears, allBtn: true
    };
    const claimCriteria = {
      title: this.filterTypes.CLAIM_CRITERIA, toolTip:
        { title: this.filterTypes.CLAIM_CRITERIA, message: this.toolTips.CLAIM_CRITERIA },
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
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title, null, false, true);
  }

  showSettingsPopUp() {
    const ref = this.modal.open(SettingsWidgetComponent, {
      centered: true,
      windowClass: 'settings-modal-dialog'
    });
    ref.componentInstance.filters = this.filters;
    ref.componentInstance.sort = this.sortList;
    ref.componentInstance.isMobile = true;
    ref.componentInstance.selectedFilterList = this.selectedFilterList;
    ref.componentInstance.filterProducts.subscribe((data) => {
      if (data !== null) {
        this.filterProducts(data);
      }
      ref.dismiss();
    });
    ref.componentInstance.showFilterTooltip.subscribe((toolTip) => {
      this.showSettingsToolTip(toolTip);
    });
    this.headerService.showMobilePopUp('removeClicked');
  }

  showSettingsToolTip(toolTip) {
    if (toolTip !== null && toolTip !== '') {
      if (toolTip.title === this.filterTypes.CLAIM_CRITERIA) {
        const ref1 = this.modal.open(MobileModalComponent, {
          centered: true
        });
        ref1.componentInstance.mobileTitle = this.filterModalData.TITLE;
        ref1.componentInstance.description = this.filterModalData.DESCRIPTION;
        ref1.componentInstance.icon_description = this.filterModalData.LOGO_DESCRIPTION;
      } else {
        const ref1 = this.modal.open(ToolTipModalComponent, { centered: true });
        ref1.componentInstance.tooltipTitle = toolTip.title;
        ref1.componentInstance.tooltipMessage = toolTip.message;
      }
    }
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
      this.selectedComparePlans.push(data.plan);
    } else {
      const index: number = this.selectedComparePlans.indexOf(data.plan);
      if (index !== -1) {
        this.selectedComparePlans.splice(index, 1);
      }
    }
  }

  compare() {
    this.directService.setSelectedPlans(this.selectedComparePlans);
    this.router.navigate([DIRECT_ROUTE_PATHS.COMPARE_PLANS]);
  }

  proceedSelection() {
    this.selectedPlansService.setSelectedPlan(this.selectedPlans, this.enquiryId);
    const modalRef = this.modal.open(CreateAccountModelComponent, {
      windowClass: 'position-bottom',
      centered: true
    });
    modalRef.componentInstance.data = this.selectedPlans.length;
  }

  toggleComparePlans() {
    this.selectedPlans = [];
    this.selectedComparePlans = [];
    this.isComparePlanEnabled = !this.isComparePlanEnabled;
    this.planWidgets.forEach((widget) => {
      widget.unselectPlan();
    });
    window.scroll(0, 0);
  }

  filterProducts(data: any) {
    this.filterArgs = this.selectedFilterList = data.filters;
    this.sortProperty = data.sortProperty;
  }
}

