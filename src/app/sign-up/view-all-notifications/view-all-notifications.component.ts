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
  allMessages;

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
    this.notifications = this.getAllNotifications();
    this.notificationCount = this.notifications.length;
    console.log(this.notifications);
  }

  getAllNotifications() {
    this.signUpService.getAllNotifications().subscribe((response) => {
      this.notifications = response.objectList.notifications;
      const allMessages = this.signUpService.getAllMessagesByNotifications(this.notifications);
      //this.markNotificationsRead(allMessages);
    });
  }

  markNotificationsRead(messages) {
    this.signUpService.markNotificationsRead(messages).subscribe((response) => {
    });
  }

  clearNotification(message, notification) {
    //this.deleteNotification([message]);
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
    const allMessages = this.signUpService.getAllMessagesByNotifications(this.notifications);
    //this.deleteNotification(allMessages);
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
