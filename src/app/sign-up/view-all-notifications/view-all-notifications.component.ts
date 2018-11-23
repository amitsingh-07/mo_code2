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
    /*
    this.signUpService.getAllNotifications().subscribe((response) => {
    console.log(response);
    this.notifications = response.objectList;
    console.log(this.notifications);
    this.notificationCount = this.notifications.length;
    });
    */

  const response = {
    'responseMessage': {
      'responseCode': 6000,
      'responseDescription': 'Successful response'
    },
    'objectList': [{
      'id': 1,
      'description': 'this is a sample notification',
      'message': 'Notification 1',
      'time': '5 Mins ago'

    }, {
      'id': 2,
      'description': 'this is a sample notification',
      'message': 'Notification 2',
      'time': '10 Mins ago'
    }, {
      'id': 3,
      'description': 'this is a sample notification',
      'message': 'Notification 3',
      'time': '20 Mins ago'
    }, {
      'id': 4,
      'description': 'this is a sample notification',
      'message': 'Notification 4',
      'time': '25 Mins ago'
    }, {
      'id': 5,
      'description': 'this is a sample notification',
      'message': 'Notification 5',
      'time': '30 Mins ago'
    }, {
      'id': 6,
      'description': 'this is a sample notification',
      'message': 'Notification 6',
      'time': '30 Mins ago'
    }, {
      'id': 7,
      'description': 'this is a sample notification',
      'message': 'Notification 7',
      'time': '30 Mins ago'
    }]

                    };
  this.notifications = response.objectList;
  this.notificationCount = this.notifications.length;

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
