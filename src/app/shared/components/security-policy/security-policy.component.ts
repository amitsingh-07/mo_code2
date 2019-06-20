import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { FooterService } from './../../footer/footer.service';
import { NavbarService } from './../../navbar/navbar.service';

@Component({
  selector: 'app-security-policy',
  templateUrl: './security-policy.component.html',
  styleUrls: ['./security-policy.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SecurityPolicyComponent implements OnInit {

  constructor(public router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(true);
  }

}
