import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AccountCreationService } from '../../account-creation/account-creation-service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { SignUpApiService } from '../../../sign-up/sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { ManagementService } from '../management.service';

@Component({
  selector: 'app-topup-status',
  templateUrl: './topup-status.component.html',
  styleUrls: ['./topup-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopupStatusComponent implements OnInit {
  status;
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private modal: NgbModal,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public managementService: ManagementService,
    private signUpService: SignUpService,
    private signUpApiService: SignUpApiService,
    private accountCreationService: AccountCreationService
  ) {}
  ngOnInit() {
    this.managementService.clearTopUpData();
    this.route.params.subscribe((params) => {
      this.status = params['status'];
    });
    this.refreshUserProfileInfo();
  }

  refreshUserProfileInfo() {
    this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
      if (userInfo.responseMessage.responseCode < 6000) {
        // ERROR SCENARIO
        if (
          userInfo.objectList &&
          userInfo.objectList.length &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors &&
          userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors.length
        ) {
          this.showCustomErrorModal(
            'Error!',
            userInfo.objectList[userInfo.objectList.length - 1].serverStatus.errors[0].msg
          );
        } else if (userInfo.responseMessage && userInfo.responseMessage.responseDescription) {
          const errorResponse = userInfo.responseMessage.responseDescription;
          this.showCustomErrorModal('Error!', errorResponse);
        } else {
          this.accountCreationService.showGenericErrorModal();
        }
      } else {
        this.signUpService.setUserProfileInfo(userInfo.objectList);
      }
    },
      (err) => {
        this.accountCreationService.showGenericErrorModal();
      });
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  goToNext() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
}
