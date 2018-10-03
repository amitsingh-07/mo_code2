import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userProfileInfo: any;

  constructor(
    public readonly translate: TranslateService,
    private signUpService: SignUpService,
    private navbarService: NavbarService
    ) { }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.translate.use('en');
  }
}
