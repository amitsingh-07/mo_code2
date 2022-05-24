import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';

@Component({
  selector: 'app-singpass-callback',
  templateUrl: './singpass-callback.component.html',
  styleUrls: ['./singpass-callback.component.scss']
})
export class SingpassCallBackComponent implements OnInit {

  data: any;
  myInfoSubscription: any;
  constructor(
    private router: Router, private route: ActivatedRoute,
    public authService: AuthenticationService
    ) {
      this.route.queryParams.subscribe((qp) => {
        console.log('Get Router Params:', this.route.snapshot.queryParams);
        if(qp['code'] && qp['state']) {
          console.log("IM INSIDE"+ "code = "+qp['code']+ "state = "+ qp['state'])
          // Check if User is authenticated yet
          if (!this.authService.isAuthenticated()) {
            this.authService.authenticate().subscribe((token) => {
            });
          }
          // Call BE for Singpass Token, result should be similar as per verifyLogin in signUpApiService
          // this.signUpApiService.verifyLogin(this.loginForm.value.loginUsername, this.loginForm.value.loginPassword,
          //   this.loginForm.value.captchaValue, this.finlitEnabled, accessCode, loginType, organisationCode).subscribe((data) => {
          //     if (data.responseMessage && data.responseMessage.responseCode >= 6000) {
          //       // Pulling Customer information to log on Hubspot
          //       this.signUpApiService.getUserProfileInfo().subscribe((data) => {
          //         let userInfo = data.objectList;
          //         this.hubspotService.registerEmail(userInfo.emailAddress);
          //         this.hubspotService.registerPhone(userInfo.mobileNumber);
          //         const hsPayload = [
          //           {
          //             name: "email",
          //             value: userInfo.emailAddress
          //           },
          //           {
          //             name: "phone",
          //             value: userInfo.mobileNumber
          //           },
          //           {
          //             name: "firstname",
          //             value: userInfo.firstName
          //           },
          //           {
          //             name: "lastname",
          //             value: userInfo.lastName
          //           }];
          //         this.hubspotService.submitLogin(hsPayload);
          //       });
    
          //       this.investmentCommonService.clearAccountCreationActions();
          //       try {
          //         if (data.objectList[0].customerId) {
          //           this.appService.setCustomerId(data.objectList[0].customerId);
          //         }
          //       } catch (e) {
          //         console.log(e);
          //       }
          //       this.signUpService.removeCaptchaSessionId();
          //       const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
          //       if (this.checkInsuranceEnquiry(insuranceEnquiry)) {
          //         this.updateInsuranceEnquiry(insuranceEnquiry, data, false);
          //       } else {
          //         this.goToNext();
          //       }
          //     } else if (data.responseMessage.responseCode === 5016 || data.responseMessage.responseCode === 5011) {
          //       this.loginForm.controls['captchaValue'].reset();
          //       this.loginForm.controls['loginPassword'].reset();
          //       this.openErrorModal(data.responseMessage.responseDescription);
          //       this.refreshCaptcha();
          //     } else if (data.responseMessage.responseCode === 5012 || data.responseMessage.responseCode === 5014) {
          //       if (data.responseMessage.responseCode === 5014) {
          //         this.signUpService.setUserMobileNo(data.objectList[0].mobileNumber);
          //         this.signUpService.setFromLoginPage();
          //       }
          //       if (data.objectList[0]) {
          //         this.signUpService.setCustomerRef(data.objectList[0].customerRef);
          //       }
          //       const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
          //       if (this.checkInsuranceEnquiry(insuranceEnquiry)) {
          //         this.updateInsuranceEnquiry(insuranceEnquiry, data, true);
          //       } else {
          //         this.callErrorModal(data);
          //       }
          //     } else {
          //       this.loginForm.controls['captchaValue'].reset();
          //       this.loginForm.controls['loginPassword'].reset();
          //       if (this.finlitEnabled) {
          //         this.loginForm.controls['accessCode'].reset();
          //       }
          //       this.openErrorModal(data.responseMessage.responseDescription);
          //       this.signUpService.setCaptchaCount();
          //       if (data.objectList[0] && data.objectList[0].sessionId) {
          //         this.signUpService.setCaptchaSessionId(data.objectList[0].sessionId);
          //       } else if (data.objectList[0].attempt >= 3 || this.signUpService.getCaptchaCount() >= 2) {
          //         this.signUpService.setCaptchaShown();
          //         this.setCaptchaValidator();
          //       }
          //     }
          //   });
        } else {
          console.log("GOING HOME")
          this.router.navigate(['home']);
        }
      });
    }

  ngOnInit() {}
  
}
