import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';

@Component({
  selector: 'app-review-your-details',
  templateUrl: './review-your-details.component.html',
  styleUrls: ['./review-your-details.component.scss']
})
export class ReviewYourDetailsComponent implements OnInit {

  constructor(private translate: TranslateService, private router: Router,
              private _location: Location, public navbarService: NavbarService ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
  }

  goToNext() {
    this.router.navigate([WILL_WRITING_ROUTE_PATHS.CONFIRMATION]);
  }

  goBack() {
    this._location.back();
  }
}
