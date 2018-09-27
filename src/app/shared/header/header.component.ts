import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IPageComponent } from '../interfaces/page-component.interface';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements IPageComponent, OnInit, AfterViewInit {

  pageTitle: string;
  subTitle = '';
  helpIcon = false;
  // helpIcon: boolean;
  showOverallHeader = true;
  showHeader = true;
  showHeaderDropshadow = true;
  closeIcon = false;

  constructor(public headerService: HeaderService, private _location: Location , private router: Router) {  }

  ngOnInit() {
    this.headerService.currentPageTitle.subscribe((title) => this.pageTitle = title);
    this.headerService.currentPageSubTitle.subscribe((subTitle) => this.subTitle = subTitle);
    this.headerService.currentPageHelpIcon.subscribe((helpIcon) => this.helpIcon = helpIcon);
    this.headerService.currentPageProdInfoIcon.subscribe((closeIcon) => this.closeIcon = closeIcon);
  }

  ngAfterViewInit() {
    this.headerService.currentHeaderOverallVisibility.subscribe((showOverallHeader) => this.showOverallHeader = showOverallHeader);
    this.headerService.currentHeaderVisibility.subscribe((showHeader) => this.showHeader = showHeader);
    this.headerService.currentHeaderDropshadow.subscribe((showHeaderDropshadow) => {
      this.showHeaderDropshadow = showHeaderDropshadow;
      console.log(this.showHeaderDropshadow);
    });
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, this.subTitle, this.helpIcon);
  }

  hideHeader() {
    this.headerService.setHeaderVisibility(false);
  }

  showMobilePopUp() {
    this.headerService.showMobilePopUp(this.pageTitle);
  }

  hideProdInfo() {
    this.headerService.setProdButtonVisibility(false);
  }

  goBack() {
    this._location.back();
  }
}
