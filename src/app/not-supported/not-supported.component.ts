import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NavbarService } from '../shared/navbar/navbar.service';
import { FooterService } from '../shared/footer/footer.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-not-supported',
  templateUrl: './not-supported.component.html',
  styleUrls: ['./not-supported.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotSupportedComponent implements OnInit {

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

}
