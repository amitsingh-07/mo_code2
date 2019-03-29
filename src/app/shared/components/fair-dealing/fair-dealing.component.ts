import { Component, OnInit } from '@angular/core';

import { FooterService } from './../../footer/footer.service';
import { NavbarService } from './../../navbar/navbar.service';

@Component({
  selector: 'app-fair-dealing',
  templateUrl: './fair-dealing.component.html',
  styleUrls: ['./fair-dealing.component.scss']
})
export class FairDealingComponent implements OnInit {

  constructor(public navbarService: NavbarService, public footerService: FooterService) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(1);
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(true);
  }

}
