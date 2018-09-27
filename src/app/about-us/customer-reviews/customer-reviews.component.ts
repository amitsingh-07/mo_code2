import { Component, OnInit } from '@angular/core';

import { HeaderService } from './../../shared/header/header.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-customer-reviews',
  templateUrl: './customer-reviews.component.html',
  styleUrls: ['./customer-reviews.component.scss']
})
export class CustomerReviewsComponent implements OnInit {

  numbers = Array(5).fill(0).map((x, i) => i);

  constructor(public headerService: HeaderService, public navbarService: NavbarService) {

  }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarShadowVisibility(true);
    this.headerService.setHeaderOverallVisibility(false);
  }

}
