import { Component, OnInit } from '@angular/core';

import { HeaderService } from './../../shared/header/header.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements IPageComponent, OnInit {
  pageTitle: string;

  constructor(public headerService: HeaderService) {
    this.pageTitle = 'Get Started';
   }

  ngOnInit() {
    this.headerService.setPageTitle(this.pageTitle);
  }

}
