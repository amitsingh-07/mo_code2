import { Component, OnInit } from '@angular/core';

import { IPageComponent } from './../interfaces/page-component.interface';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements IPageComponent, OnInit {

  pageTitle: string;
  constructor(public headerService: HeaderService) {  }

  ngOnInit() {
    this.headerService.currentPageTitle.subscribe((title) => this.pageTitle = title);
  }

}
