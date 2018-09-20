import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
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

  selectedPlans: any[] = [];

  constructor(
    private directService: DirectService, private directApiService: DirectApiService,
    private router: Router, private translate: TranslateService, public headerService: HeaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESULTS.TITLE');
      this.setPageTitle(this.pageTitle);
    });

    console.log(this.directService.getProductCategory());
    this.directApiService.getSearchResults(this.directService.getProductCategory())
      .subscribe((data) => {
        this.searchResult = data.objectList[0].productProtectionTypeList;
        console.log(this.searchResult);
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
}
