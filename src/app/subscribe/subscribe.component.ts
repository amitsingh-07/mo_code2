import { Component, OnInit } from '@angular/core';

import { FooterService } from './../shared/footer/footer.service';
import { HeaderService } from './../shared/header/header.service';
import { NavbarService } from './../shared/navbar/navbar.service';

import { MailchimpApiService } from './../shared/Services/mailchimp.api.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  constructor(private navbarService: NavbarService, private headerService: HeaderService, private footerService: FooterService) { }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarShadowVisibility(true);
    this.headerService.setHeaderDropshadowVisibility(false);
    this.headerService.setHeaderOverallVisibility(false);

    this.footerService.setFooterVisibility(true);
  }
}
