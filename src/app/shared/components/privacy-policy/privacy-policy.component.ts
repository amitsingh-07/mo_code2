import { Component, OnInit } from '@angular/core';

import { Router} from '@angular/router';
import { FooterService } from './../../footer/footer.service';
import { NavbarService } from './../../navbar/navbar.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    public router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(true);
  }

}
