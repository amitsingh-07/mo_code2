import { Component, OnInit } from '@angular/core';

import { HeaderService } from './../shared/header/header.service';
import { NavbarService } from './../shared/navbar/navbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public headerService: HeaderService, public navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarShadowVisibility(false);
    this.headerService.setHeaderOverallVisibility(false);
  }
}
