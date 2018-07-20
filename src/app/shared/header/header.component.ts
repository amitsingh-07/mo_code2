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
  constructor(public headerService: HeaderService, private _location: Location , private router: Router) {  }

  ngOnInit() {
    this.headerService.currentPageTitle.subscribe((title) => this.pageTitle = title);
  }

  goBack() {
    this._location.back();
  }
}
