import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
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
    public headerService: HeaderService) { }

  ngOnInit() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.translate.use('en');
    this.setPageTitle();
  }

  setPageTitle() {
    this.headerService.setPageTitle('');
  }

}
