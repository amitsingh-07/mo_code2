import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { HeaderService } from './../../shared/header/header.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(public headerService: HeaderService) {
    this.pageTitle = 'Get Started';
   }

  ngOnInit() {
    this.setPageTitle(this.pageTitle);
  }

  setPageTitle(title: string){
    this.headerService.setPageTitle(title);
  }
}
