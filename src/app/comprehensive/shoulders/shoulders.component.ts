import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-shoulders',
  templateUrl: './shoulders.component.html',
  styleUrls: ['./shoulders.component.scss']
})
export class ShouldersComponent implements OnInit {
  pageTitle: string;
  shouldersForm: FormGroup;
  constructor(public navbarService: NavbarService, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('SHOULDERS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
   }

  setPageTitle(title: string) {
  this.navbarService.setPageTitle(title);
  }
  ngOnInit() {

     this.navbarService.setNavbarDirectGuided(true);
     this.shouldersForm = new FormGroup({
      shoulders_dependant: new FormControl('', Validators.required)
    });
  }
}
