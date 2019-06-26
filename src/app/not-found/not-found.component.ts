import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NavbarService } from '../shared/navbar/navbar.service';
import { FooterService } from '../shared/footer/footer.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotFoundComponent implements OnInit {

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

}
