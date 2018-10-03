import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DirectApiService } from '../direct.api.service';
import { DirectService } from '../direct.service';
import { HeaderService } from './../../shared/header/header.service';

@Component({
  selector: 'app-edit-product-info',
  templateUrl: './edit-product-info.component.html',
  styleUrls: ['./edit-product-info.component.scss']
})
export class EditProductInfoComponent implements OnInit {

  @Output() editProdInfo: EventEmitter<any> = new EventEmitter();

  pageTitle;
  toggleVisibility = true;
  mobileThreshold = 567;
  toggleBackdropVisibility = false;
  productCategoryList: any;
  productCategorySelectedIndex: number;
  productCategorySelected: any;
  minProdSearch: string;
  initLoad = true;
  productCategorySelectedLogo: string;

  constructor(
    private directService: DirectService, private directApiService: DirectApiService,
    private translate: TranslateService, private headerService: HeaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((results) => {
      this.pageTitle = this.translate.instant('PROFILE.TITLE2');
    });

    this.directService.modalFreezeCheck.subscribe((freezeCheck) => {
      if (!freezeCheck) {
        this.toggleVisibility = false;
      }
    });
  }

  ngOnInit() {

    this.directService.prodSearchInfoData.subscribe((data) => {
      if (data !== '') {
        this.minProdSearch = data;
        if (this.initLoad === true) { // Initial Load Case
          this.initLoad = false;
        }
        this.toggleVisibility = false;
        this.toggleBackdropVisibility = false;
        this.directService.setModalFreeze(false);
      }
      this.initCategorySetup();
    });
  }

  initCategorySetup() {
    const element = this.directService.getProductCategory();
    this.productCategorySelected = element.prodCatName;
    this.productCategorySelectedIndex = element.id;
    this.productCategorySelectedLogo = element.prodCatIcon;
  }

  editProdInfoForm() {
    this.directService.currentIndexValue = this.productCategorySelectedIndex;
    this.toggleVisibility = true;
    this.headerService.setPageTitle(this.pageTitle);
    this.directService.setModalFreeze(true);
  }

}
