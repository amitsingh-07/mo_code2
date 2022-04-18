import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../http/auth/authentication.service';

import { environment } from './../../../../environments/environment';
import { FooterService } from './../../footer/footer.service';
import { NavbarService } from './../../navbar/navbar.service';

@Component({
  selector: 'app-disclosures',
  templateUrl: './disclosures.component.html',
  styleUrls: ['./disclosures.component.scss']
})
export class DisclosuresComponent implements OnInit {

  constructor(public router: Router,
              public navbarService: NavbarService,
              public footerService: FooterService,
              public authService: AuthenticationService) { }

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
