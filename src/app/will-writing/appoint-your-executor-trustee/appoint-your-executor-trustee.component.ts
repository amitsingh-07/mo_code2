import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';

@Component({
  selector: 'app-appoint-your-executor-trustee',
  templateUrl: './appoint-your-executor-trustee.component.html',
  styleUrls: ['./appoint-your-executor-trustee.component.scss']
})
export class AppointYourExecutorTrusteeComponent implements OnInit {

  constructor(private translate: TranslateService, private router: Router, private _location: Location) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

  goToNext() {
    this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_BENEFICIARIES]);
  }
  goBack() {
    this._location.back();
  }
}
