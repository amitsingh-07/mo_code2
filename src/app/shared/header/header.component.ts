import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IPageComponent } from './../interfaces/page-component.interface';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements IPageComponent, OnInit {

  pageTitle: string;
  subTitle = '';
  helpIcon: boolean;
  showHeader = true;

  constructor(public headerService: HeaderService, private _location: Location , private router: Router) {  }

  ngOnInit() {
    this.headerService.currentPageTitle.subscribe((title) => this.pageTitle = title);
    this.headerService.currentPageSubTitle.subscribe((subTitle) => this.subTitle = subTitle);
    this.headerService.currentPageHelpIcon.subscribe((helpIcon) => this.helpIcon = helpIcon);
    this.headerService.currentHeaderVisibility.subscribe((showHeader) => this.showHeader = showHeader);
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, this.subTitle, this.helpIcon);
  }

  hideHeader() {
    this.headerService.setHeaderVisibility(false);
  }

  showMobilePopUp() {
    this.headerService.showMobilePopUp('Clicked');
  }

  goBack() {
    this._location.back();
  }
}
