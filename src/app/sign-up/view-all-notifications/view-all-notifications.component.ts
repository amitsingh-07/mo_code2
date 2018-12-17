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
import { SignUpService } from '../sign-up.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';

@Component({
  selector: 'app-view-all-notifications',
  templateUrl: './view-all-notifications.component.html',
  styleUrls: ['./view-all-notifications.component.scss']
})
export class ViewAllNotificationsComponent implements OnInit {
  pageTitle: string;
  notifications: any;
  ref;

  constructor(
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private signUpService: SignUpService,
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
    this.getAllNotifications();
  }

  getAllNotifications() {
    this.signUpService.getAllNotifications().subscribe((response) => {
      this.notifications = response.objectList[0].notifications;
      this.updateNotifications(null, SIGN_UP_CONFIG.NOTIFICATION.READ_PAYLOAD_KEY);
    });
  }

  updateNotifications(messages, type) {
    this.signUpService.updateNotifications(messages, type).subscribe((response) => {
    });
  }

  clearNotification(message, notification) {
    this.updateNotifications([message], SIGN_UP_CONFIG.NOTIFICATION.DELETE_PAYLOAD_KEY);
    const updatedMessagesList = notification.messages.filter((notificationMessage) => message !== notificationMessage);
    if (updatedMessagesList.length) {
      notification.messages = updatedMessagesList;
    } else {
      const updatedNotificationList = this.notifications.filter((currentNotification) => notification !== currentNotification);
      this.notifications = updatedNotificationList;
    }
    console.log(this.notifications);
  }

  clearAllNotifications() {
    this.updateNotifications(null, SIGN_UP_CONFIG.NOTIFICATION.DELETE_PAYLOAD_KEY);
    this.notifications.splice(0);
  }

  deleteNotification(messageList) {
    const payload = this.constructDeleteNotificationRequest(messageList);
    this.signUpService.deleteNotifications(payload).subscribe((response) => {

    });
  }

  constructDeleteNotificationRequest(messages) {
    return {
      messageList: messages
    };
  }

}
