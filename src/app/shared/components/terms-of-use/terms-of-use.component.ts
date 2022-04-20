import { Component, OnInit } from '@angular/core';

import { environment } from './../../../../environments/environment';
import { FooterService } from './../../footer/footer.service';
import { NavbarService } from './../../navbar/navbar.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss']
})
export class TermsOfUseComponent implements OnInit {

  constructor(public navbarService: NavbarService, public footerService: FooterService) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarVisibility(true);
    if (environment.hideHomepage) {
      this.footerService.setFooterVisibility(false);
    } else {
      this.footerService.setFooterVisibility(true);
    }
  }

}
