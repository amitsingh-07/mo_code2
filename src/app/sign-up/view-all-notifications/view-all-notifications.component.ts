import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PortfolioService } from '../../portfolio/portfolio.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GroupByPipe } from '../../shared/Pipes/group-by.pipe';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-view-all-notifications',
  templateUrl: './view-all-notifications.component.html',
  styleUrls: ['./view-all-notifications.component.scss']
})
export class ViewAllNotificationsComponent implements OnInit {
  pageTitle: string;
  ref;
  allMessages;

  constructor(
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private signUpService: SignUpService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public portfolioService: PortfolioService,
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
      const notifications = response.objectList[0].notifications;
      this.allMessages = this.signUpService.getAllMessagesByNotifications(notifications);
      this.portfolioService.sortByProperty(this.allMessages, 'time', 'desc');
      this.allMessages = new GroupByPipe().transform(this.allMessages, 'month');
      this.updateNotifications(null, SIGN_UP_CONFIG.NOTIFICATION.READ_PAYLOAD_KEY);
    });
  }

  updateNotifications(messages, type) {
    this.signUpService.updateNotifications(messages, type).subscribe((response) => {
    });
  }

  clearNotification(message, group) {
    this.updateNotifications([message], SIGN_UP_CONFIG.NOTIFICATION.DELETE_PAYLOAD_KEY);
    const updatedMessagesList = group.value.filter((notificationMessage) => message !== notificationMessage);
    if (updatedMessagesList.length) {
      group.value = updatedMessagesList;
    } else {
      const updatedNotificationList = this.allMessages.filter((currentNotification) => group !== currentNotification);
      this.allMessages = updatedNotificationList;
    }
  }

  clearAllNotifications() {
    this.updateNotifications(null, SIGN_UP_CONFIG.NOTIFICATION.DELETE_PAYLOAD_KEY);
    this.allMessages.splice(0);
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
