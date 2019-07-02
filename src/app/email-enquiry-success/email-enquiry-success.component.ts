import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NavbarService } from '../shared/navbar/navbar.service';
import { FooterService } from '../shared/footer/footer.service';

@Component({
  selector: 'app-email-enquiry-success',
  templateUrl: './email-enquiry-success.component.html',
  styleUrls: ['./email-enquiry-success.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailEnquirySuccessComponent implements OnInit {

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(2);
    this.footerService.setFooterVisibility(false);
  }

}
