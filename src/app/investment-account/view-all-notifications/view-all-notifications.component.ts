import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import {
  AccountCreationErrorModalComponent
} from '../account-creation-error-modal/account-creation-error-modal.component';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { TopBarWithClearButtonComponent } from '../top-bar-with-clear-button/top-bar-with-clear-button.component';

@Component({
  selector: 'app-view-all-notifications',
  templateUrl: './view-all-notifications.component.html',
  styleUrls: ['./view-all-notifications.component.scss']
})
export class ViewAllNotificationsComponent implements OnInit {
  pageTitle: string;
  notifications: any;
  ref;
  notificationCount: any;
  constructor(
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = 'Notifications';
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.investmentAccountService.getAllNotifications().subscribe((response) => {
    console.log(response);
    this.notifications = response.objectList;
    console.log(this.notifications);
    this.notificationCount = this.notifications.length;
    });
  }
  hideNotification(notification) {
    console.log(notification);
    const index = this.notifications.indexOf(notification);
    console.log(index);
    this.notifications.splice(index, 1);
    this.notificationCount = this.notifications.length;
  }
  clearAll($event) {
    this.notifications.splice(0);
    this.notificationCount = this.notifications.length;
  }

}
