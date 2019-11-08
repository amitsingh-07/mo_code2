import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { NavbarService } from 'src/app/shared/navbar/navbar.service';

@Component({
  selector: 'app-enquiry-success',
  templateUrl: './enquiry-success.component.html',
  styleUrls: ['./enquiry-success.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EnquirySuccessComponent implements OnInit {

  constructor(
    public navbarService: NavbarService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use('en');
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.redirectTo();
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(7);
  }

  redirectTo() {
    this.router.navigate(['/home']);
  }

}
