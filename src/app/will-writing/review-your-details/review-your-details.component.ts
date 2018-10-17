import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';

@Component({
  selector: 'app-review-your-details',
  templateUrl: './review-your-details.component.html',
  styleUrls: ['./review-your-details.component.scss']
})
export class ReviewYourDetailsComponent implements OnInit {

  constructor(private translate: TranslateService, private router: Router, private _location: Location) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

  goToNext() {
    this.router.navigate([WILL_WRITING_ROUTE_PATHS]);
  }

  goBack() {
    this._location.back();
  }
}
