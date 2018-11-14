import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
@Component({
  selector: 'app-tell-us-about-yourself',
  templateUrl: './tell-us-about-yourself.component.html',
  styleUrls: ['./tell-us-about-yourself.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TellUsAboutYourselfComponent implements OnInit {

  constructor(private translate: TranslateService, private router: Router,
              private _location: Location, public navbarService: NavbarService) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
  }
  goToNext() {
    this.router.navigate([WILL_WRITING_ROUTE_PATHS.ABOUT_ME]);
  }
  goBack() {
    this._location.back();
  }
}