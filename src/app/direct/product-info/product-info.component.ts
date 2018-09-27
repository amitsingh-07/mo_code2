import { Component, EventEmitter, HostListener, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { GoogleAnalyticsService } from '../../shared/ga/google-analytics.service';
import { HeaderService } from './../../shared/header/header.service';
import { ToolTipModalComponent } from './../../shared/modal/tooltip-modal/tooltip-modal.component';
import { DirectApiService } from './../direct.api.service';
import { DirectService } from './../direct.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductInfoComponent implements OnInit {

  @Output() formSubmitCallback: EventEmitter<any> = new EventEmitter();

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

  productCategorySelected: string;
  productCategorySelectedLogo: string;
  productCategorySelectedIndex: number;

  selectedCategoryId = 0;
  routerOptions = [
    {link: 'life-protection', id: 0},
    {link: 'critical-illness', id: 1},
    {link: 'occupational-disability', id: 2},
    {link: 'hospital-plan', id: 3},
    {link: 'long-term-care', id: 4},
    {link: 'education', id: 5},
    {link: 'savings', id: 5},
    {link: 'retirement-income', id: 6},
    {link: 'srs-approved-plans', id: 7}
  ];

  minProdSearch: string;

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

  constructor(
    public headerService: HeaderService, private directService: DirectService,
    private modal: NgbModal, private translate: TranslateService, private route: ActivatedRoute,
    private directApiService: DirectApiService, private googleAnalyticsService: GoogleAnalyticsService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      if (this.innerWidth < this.mobileThreshold) {
        this.searchText = this.translate.instant('COMMON.LBL_CONTINUE');
      } else {
        this.searchText = this.translate.instant('COMMON.LBL_SEARCH_PLAN');
      }
    });
    this.route.params.subscribe((params) => {
      console.log(params.id);
      this.routerOptions.forEach((element) => {
        if (element.link === params.id) {
          this.selectedCategoryId = element.id;
        }
      });
    });
  }

  ngOnInit() {
    // measuring width and height
    this.innerWidth = window.innerWidth;
    this.initDisplaySetup();
    this.directApiService.getProdCategoryList().subscribe((data) => {
      this.productCategoryList = data.objectList; // Getting the information from the API
      this.directService.prodCategoryIndex.subscribe((index) => {
        this.productCategorySelectedIndex = index;
        this.initCategorySetup(index);
      });
    });
    this.directService.prodSearchInfoData.subscribe((data) => {
      if (data !== '') {
        this.minProdSearch = data;
        if (this.initLoad === true) { // Initial Load Case
          this.initLoad = false;
        }
        this.toggleVisibility = false;
        this.toggleBackdropVisibility = false;
        this.directService.setModalFreeze(false);
        this.formSubmitCallback.emit(data);
      }
    });
    this.directService.modalToolTipTrigger.subscribe((data) => {
      if (data.title !== '') {
        this.openToolTipModal(data);
      }
    });
    this.googleAnalyticsService.startTime('initialDirectSearch');
  }

  // Initial Display setup
  initDisplaySetup() {
    if (this.innerWidth < this.mobileThreshold && this.initLoad) {
      this.toggleBackdropVisibility = true;
      this.toggleFormVisibility = false;
    }
  }

  initCategorySetup(prodCategoryIndex) {
    this.productCategoryList.forEach((element, i) => {
      element.active = false;
      if (i === prodCategoryIndex) {
        this.productCategorySelected = element.prodCatName;
        this.productCategorySelectedLogo = element.prodCatIcon;
        element.active = true;
      }
    });

    if (this.innerWidth < this.mobileThreshold) {
      this.selectProductCategory(this.productCategoryList[0], 0);
    }
  }

  search() {
    this.directService.triggerSearch(event);
  }

  editProdInfo() {
    this.toggleVisibility = true;
    if (this.innerWidth < this.mobileThreshold) {
      this.toggleBackdropVisibility = false;
      this.directService.setModalFreeze(true);
    } else {
      this.toggleBackdropVisibility = true;
    }
  }

  openProductCategory(index) {
    if (this.innerWidth < this.mobileThreshold) {
      this.toggleSelectVisibility = false;
      this.toggleBackdropVisibility = false;
      this.toggleVisibility = true;
      this.toggleFormVisibility = true;
      this.directService.setModalFreeze(true);
    }
    this.productCategoryList.forEach((category, i) => {
      category.active = false;
      if (i === index) {
        category.active = true;
        this.productCategorySelected = category.prodCatName;
        this.directService.setProductCategory(category);
        this.selectedCategoryId = index;
      }
    });
  }

  selectProductCategory(data, index) {
    this.productCategorySelected = data.prodCatName;
    this.directService.setProductCategory(data);
    this.selectedCategoryId = index;
  }

  openToolTipModal(data) {
    this.modalRef = this.modal.open(ToolTipModalComponent, { centered: true, windowClass: 'help-modal-dialog' });
    this.modalRef.componentInstance.tooltipTitle = data.title;
    this.modalRef.componentInstance.tooltipMessage = data.message;
    this.directService.showToolTipModal('', '');
  }
}
