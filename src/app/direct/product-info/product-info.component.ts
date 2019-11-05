import { Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ProtectionNeeds } from '../../guide-me/protection-needs/protection-needs';
import { GoogleAnalyticsService } from '../../shared/analytics/google-analytics.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { Formatter } from '../../shared/utils/formatter.util';
import { ConfigService, IConfig } from './../../config/config.service';
import { HeaderService } from './../../shared/header/header.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { ToolTipModalComponent } from './../../shared/modal/tooltip-modal/tooltip-modal.component';
import { SelectedPlansService } from './../../shared/Services/selected-plans.service';
import { StateStoreService } from './../../shared/Services/state-store.service';
import { DirectResultsComponent } from './../direct-results/direct-results.component';
import { DirectApiService } from './../direct.api.service';
import { DirectService } from './../direct.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductInfoComponent implements OnInit, OnDestroy {

  @Input() hideForm: boolean;
  @Input() isEditMode: boolean;
  @Output() formSubmitCallback: EventEmitter<any> = new EventEmitter();
  @Output() backPressed: EventEmitter<any> = new EventEmitter();

  modalRef: NgbModalRef;
  initLoad = true;
  innerWidth: any;
  mobileThreshold = 567;

  toggleVisibility = true;
  toggleSelectVisibility = true;
  toggleBackdropVisibility = false;
  toggleFormVisibility = true;
  searchText: string;
  productCategoryList: any;
  selectedCategory: any;

  productCategorySelected: string;
  productCategorySelectedLogo: string;
  productCategorySelectedIndex = 0;

  private subscription: Subscription;
  private prodSearchInfoSub: Subscription;
  pageTitle: string;
  editPageTitle: string;
  resultsPageTitle: string;

  selectedCategoryId = 0;
  routerOptions = [
    { link: 'life-protection', id: 0 },
    { link: 'critical-illness', id: 1 },
    { link: 'occupational-disability', id: 2 },
    { link: 'hospital-plan', id: 3 },
    { link: 'long-term-care', id: 4 },
    { link: 'education', id: 5 },
    { link: 'savings', id: 5 },
    { link: 'retirement-income', id: 6 },
    { link: 'srs-approved-plans', id: 7 }
  ];

  minProdSearch: string;
  /*
    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < this.mobileThreshold) {
        this.toggleFormVisibility = false;
        this.directService.setModalFreeze(false);
        this.searchText = this.translate.instant('COMMON.LBL_CONTINUE');
      } else {
        this.toggleSelectVisibility = true;
        this.toggleFormVisibility = true;
        this.searchText = this.translate.instant('COMMON.LBL_SEARCH_PLAN');
      }
    }
  */
  constructor(
    public headerService: HeaderService, private directService: DirectService,
    private modal: NgbModal, private translate: TranslateService, private route: ActivatedRoute,
    private directApiService: DirectApiService, private googleAnalyticsService: GoogleAnalyticsService,
    private cdRef: ChangeDetectorRef, private configService: ConfigService,
    private authService: AuthenticationService, public navbarService: NavbarService,
    private _location: Location, private planService: SelectedPlansService,
    private stateStoreService: StateStoreService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESULTS.TITLE');
      this.editPageTitle = this.translate.instant('PROFILE.TITLE2');
      this.resultsPageTitle = this.translate.instant('RESULTS.TITLE');
      if (this.innerWidth < this.mobileThreshold) {
        this.searchText = this.translate.instant('COMMON.LBL_CONTINUE');
      } else {
        this.searchText = this.translate.instant('COMMON.LBL_SEARCH_PLAN');
      }
    });

    this.directService.modalFreezeCheck.subscribe((freezeCheck) => {
      if (freezeCheck) {
        this.editProdInfo();
      } else if (this.isEditMode) {
        this.closeModal();
        this.isEditMode = false;
      }
    });
  }

  getProductCategoryList() {
    if (this.authService.isAuthenticated()) {
      this.getProductCategory();
    } else {
      this.authService.authenticate().subscribe((token) => {
        this.getProductCategory();
      });
    }
  }

  getProductCategory() {
    this.productCategoryList = [];
    this.directApiService.getProdCategoryList().subscribe((data) => {
      this.configService.getConfig().subscribe((config: IConfig) => {
        data.objectList.forEach((type: ProtectionNeeds) => {
          for (const category of config.productCategory) {
            if (type.protectionTypeId === category.id) {
              this.productCategoryList.push(category);
            }
          }
        });
        setTimeout(this.initCategorySetup(), 50);

      });
    });
  }

  ngOnInit() {
    if (!this.productCategoryList || !this.productCategoryList.hasOwnProperty('length') ||
      this.productCategoryList.length === 0) {
      this.getProductCategoryList();
    }

    // measuring width and height
    this.innerWidth = window.innerWidth;

    if (this.hideForm) {
      this.initLoad = false;
      this.toggleVisibility = false;
      this.toggleBackdropVisibility = false;
      this.directService.setModalFreeze(false);
    }

    this.selectedCategory = this.directService.getProductCategory();
    if (this.selectedCategory) {
      this.selectedCategoryId = this.selectedCategory.id;
      this.productCategorySelected = this.selectedCategory.prodCatName;
    }

    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (event === this.pageTitle) {
          //if (this.innerWidth < this.mobileThreshold) {

          this.minProdSearch = '';
          this.initLoad = true;
          this.toggleVisibility = true;
          this.toggleBackdropVisibility = false;
          this.directService.setModalFreeze(false);

          this.setSelectedCategory();
          this.backPressed.emit('backPressed');
          //}
        } else if (event === this.editPageTitle) {
          this.directService.setModalFreeze(false);
          this.navbarService.setPageTitle(this.resultsPageTitle, null, false, true);
        } else {
          this._location.back();
        }
      }
    });

    this.prodSearchInfoSub = this.directService.prodSearchInfoData.subscribe((data) => {
      // if (data !== '') {
      //   this.minProdSearch = data;
      //   this.initLoad = false;
      //   this.toggleVisibility = false;
      //   this.toggleBackdropVisibility = false;
      //   this.directService.setModalFreeze(false);
      //   this.formSubmitCallback.emit(data);
      // }
    });
    this.directService.modalToolTipTrigger.subscribe((data) => {
      if (data.title !== '') {
        this.openToolTipModal(data);
      }
    });
    this.googleAnalyticsService.startTime('initialDirectSearch');
    this.initDisplaySetup();

  }

  setSelectedCategory() {
    this.selectedCategory = this.directService.getProductCategory();
    this.selectedCategoryId = this.selectedCategory.id;
    this.productCategorySelected = this.selectedCategory.prodCatName;
    let catId = Formatter.getIntValue(this.selectedCategoryId);
    if (catId > 0) {
      catId = catId - 1;
    }
    this.openProductCategory(catId);
  }

  formSubmitted(data) {
    if (data !== '') {
      this.minProdSearch = data;
      this.initLoad = false;
      this.toggleVisibility = false;
      this.toggleBackdropVisibility = false;
      this.directService.setModalFreeze(false);
      this.formSubmitCallback.emit(data);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.prodSearchInfoSub.unsubscribe();
    this.navbarService.unsubscribeBackPress();
  }

  // Initial Display setup
  initDisplaySetup() {
    if (this.innerWidth < this.mobileThreshold && this.initLoad) {
      this.toggleBackdropVisibility = true;
      this.toggleFormVisibility = false;
    }
  }

  initCategorySetup() {
    this.directService.setProductCategoryList(this.productCategoryList);
    this.selectedCategory = this.directService.getProductCategory();
    let categoryIndex = this.selectedCategory.id;
    /*
    if (this.selectedCategory && categoryIndex) {
      categoryIndex = categoryIndex - 1;
      this.selectProductCategory(this.productCategoryList[categoryIndex], categoryIndex);
      this.openProductCategory(categoryIndex);
    } else if (this.innerWidth >= this.mobileThreshold) {
      this.openProductCategory(0);
    }
    */

    if (this.innerWidth >= this.mobileThreshold) {
      this.openProductCategory(0);
    }

    this.directService.updateUserInfo();
  }

  search(index) {
    this.stateStoreService.clearState(DirectResultsComponent.name);
    this.directService.setProductCategory(this.selectedCategory);
    this.directService.triggerSearch(this.selectedCategory.id + '');
  }

  editProdInfo() {
    this.isEditMode = true;
    this.toggleVisibility = true;
    this.hideForm = false;
    if (this.innerWidth < this.mobileThreshold) {
      this.toggleSelectVisibility = false;
      this.toggleBackdropVisibility = false;
      this.toggleFormVisibility = true;
    } else {
      this.setSelectedCategory();
      this.toggleBackdropVisibility = true;
    }
  }

  minProdInfo() {
    this.directService.setModalFreeze(false);
    }

  closeModal() {
    this.toggleVisibility = false;
    this.toggleBackdropVisibility = false;
  }

  openProductCategory(index) {
    if (this.innerWidth < this.mobileThreshold) {
      this.toggleSelectVisibility = false;
      this.toggleBackdropVisibility = false;
      this.toggleVisibility = true;
      this.toggleFormVisibility = true;
      this.directService.setModalFreeze(true);
    }
    if (!this.productCategoryList) {
      this.productCategoryList = this.directService.getProductCategoryList();
    }
    const category = this.productCategoryList[index];
    category.active = true;
    this.selectProductCategory(category, index);
  }

  selectProductCategory(data, index) {
    this.productCategorySelected = data.prodCatName;
    this.selectedCategory = data;
    this.selectedCategoryId = data.id;
    this.setActiveProductCategory(index);
  }

  setActiveProductCategory(index) {
    this.productCategoryList.forEach((element, i) => {
      element.active = false;
      if (i === index) {
        this.productCategorySelected = element.prodCatName;
        this.productCategorySelectedLogo = element.prodCatIcon;
        element.active = true;
      }
    });
  }

  openToolTipModal(data) {
    this.modalRef = this.modal.open(ToolTipModalComponent, { centered: true });
    this.modalRef.componentInstance.tooltipTitle = data.title;
    this.modalRef.componentInstance.tooltipMessage = data.message;
    this.directService.showToolTipModal('', '');
  }
}
