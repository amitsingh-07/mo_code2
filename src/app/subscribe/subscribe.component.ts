import { Component, OnInit } from '@angular/core';

import { HeaderService } from './../shared/header/header.service';
import { NavbarService } from './../shared/navbar/navbar.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  constructor(private navbarService: NavbarService, private headerService: HeaderService) { }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(false);
    this.headerService.setHeaderDropshadowVisibility(true);
    this.headerService.setHeaderOverallVisibility(true);
  }
}
