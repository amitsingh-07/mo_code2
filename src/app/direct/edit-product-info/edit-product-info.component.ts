import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DirectApiService } from '../direct.api.service';
import { DirectService } from '../direct.service';

@Component({
  selector: 'app-edit-product-info',
  templateUrl: './edit-product-info.component.html',
  styleUrls: ['./edit-product-info.component.scss']
})
export class EditProductInfoComponent implements OnInit {
  toggleVisibility = true;
  mobileThreshold = 567 ;
  toggleBackdropVisibility = false;
  productCategoryList: any;
  productCategorySelectedIndex: number;
  productCategorySelected: any;
  minProdSearch: string;
  initLoad = true;
  productCategorySelectedLogo: string;

  constructor(private route: Router, private directService: DirectService, private directApiService: DirectApiService) { }

  ngOnInit() {
    this.directApiService.getProdCategoryList().subscribe((data) => {
    this.productCategoryList = data.objectList;
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
      }
    });
  }

  initCategorySetup(prodCategoryIndex) {
    this.productCategoryList.forEach((element, i) => {
      element.active = false;
      if (i === prodCategoryIndex) {
        this.productCategorySelected = element.prodCatName;
        this.productCategorySelectedIndex = element.prodCatIcon;
        this.productCategorySelectedLogo = element.prodCatIcon;
        element.active = true;
      }
    });
  }

  editProdInfo() {
    this.directService.currentIndexValue = this.productCategorySelectedIndex;
    this.toggleVisibility = true;
    if (window.innerWidth < this.mobileThreshold) {
      this.toggleBackdropVisibility = false;
      this.directService.setModalFreeze(true);
    } else {
      this.toggleBackdropVisibility = true;
    }
    this.route.navigate(['direct']);
  }

}
