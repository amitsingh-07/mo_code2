import { Component, OnInit } from '@angular/core';

import { FooterService } from './../../footer/footer.service';
import { NavbarService } from './../../navbar/navbar.service';

@Component({
  selector: 'app-disclosures',
  templateUrl: './disclosures.component.html',
  styleUrls: ['./disclosures.component.scss']
})
export class DisclosuresComponent implements OnInit {

  constructor(public navbarService: NavbarService, public footerService: FooterService) { }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMobileVisibility(true);
    this.footerService.setFooterVisibility(true);
  }

}
