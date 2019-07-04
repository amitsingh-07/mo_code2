import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { NavbarService } from '../shared/navbar/navbar.service';
import { FooterService } from '../shared/footer/footer.service';

@Component({
  selector: 'app-email-enquiry-success',
  templateUrl: './email-enquiry-success.component.html',
  styleUrls: ['./email-enquiry-success.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailEnquirySuccessComponent implements OnInit {

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.router.navigate(['/home']);
  }

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService,
    private router: Router) { }

  ngOnInit() {
    this.navbarService.setNavbarMode(2);
    this.footerService.setFooterVisibility(false);
  }

}
