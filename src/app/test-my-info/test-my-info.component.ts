import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { GuideMeApiService } from '../guide-me/guide-me.api.service';
import { GuideMeService } from '../guide-me/guide-me.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../shared/navbar/navbar.service';
import { MyInfoService } from './../shared/Services/my-info.service';

@Component({
  selector: 'app-test-my-info',
  templateUrl: './test-my-info.component.html',
  styleUrls: ['./test-my-info.component.scss']
})
export class TestMyInfoComponent implements OnInit {
  testMyInfoForm: FormGroup;
  assetsTotal = 0;
  cpfValue;
  pageTitle: string;
  project: string;
  robo2Results: any;
  constructor(
    private guideMeService: GuideMeService, private guideMeApiService: GuideMeApiService,
    public navbarService: NavbarService,
    private modal: NgbModal, private myInfoService: MyInfoService,
    public authService: AuthenticationService,
    private translate: TranslateService, private activeModal: NgbActiveModal,
    private route: ActivatedRoute) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Test MyInfo');
      this.setPageTitle(this.pageTitle);
    });
  }
  ngOnInit() {
    // Robo2 changes
    this.project = this.route.snapshot.queryParams.project;
    this.testMyInfoForm = new FormGroup({
      cpf: new FormControl('')
    });
    this.authService.authenticate().subscribe((token) => {
    });
    this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '') {
        if (myinfoObj.status && myinfoObj.status === 'SUCCESS' && this.myInfoService.isMyInfoEnabled) {
          // Todo - Robo2 changes
          if (this.project === 'robo') {
            this.closeMyInfoPopup();
            window.opener.postMessage(myinfoObj.authorizeCode, '*');
            // tslint:disable-next-line:max-line-length
            // window.location.href = 'https://bfa-uat2.ntucbfa.com/myinfo?code=' + myinfoObj.authorizeCode + '&scope=occupation%20mailadd%20passportnumber%20nationality%20dob%20name%20regadd%20passportexpirydate%20householdincome%20sex%20employment&iss=https%3A%2F%2Fstg-home.singpass.gov.sg%2Fconsent%2Foauth2%2Fconsent%2Fmyinfo-com&state=149&client_id=myinfo';
          } else {
            this.myInfoService.getMyInfoData().subscribe((data) => {
              if (this.project === 'robo2') {
                this.robo2Results = data['objectList'];
                console.log(data);
              } else if (data && data['objectList']) {
                this.cpfValue = Math.floor(data['objectList'][0].cpfbalances.total);
                this.testMyInfoForm.controls['cpf'].setValue(this.cpfValue);
                this.myInfoService.isMyInfoEnabled = false;
                this.setFormTotalValue();
                this.closeMyInfoPopup();
                } else {
                  this.closeMyInfoPopup();
                }
            }, (error) => {
              this.closeMyInfoPopup();
            });
         }
        } else {
          this.closeMyInfoPopup();
        }
      }
    });
    // Todo - Robo2 MyInfo changes
    // if (this.project === 'robo2') {
    //   const myInfoAttributes1 = ['nationality', 'name', 'passportnumber', 'passportexpirydate',
    //   'dob', 'sex', 'regadd', 'mailadd', 'employment', 'occupation', 'householdincome'];
    //   this.myInfoService.setMyInfoAttributes(myInfoAttributes1);
    //   this.myInfoService.goToMyInfo();
    // }
  }
  setFormTotalValue() {
    this.assetsTotal = this.guideMeService.additionOfCurrency(this.testMyInfoForm.value);
  }

  closeMyInfoPopup() {
    this.myInfoService.closeFetchPopup();
    if (this.myInfoService.isMyInfoEnabled) {
      this.myInfoService.changeListener.next('');
      this.myInfoService.isMyInfoEnabled = false;
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = 'Oops, Error!';
      ref.componentInstance.errorMessage = 'We weren\'t able to fetch your data from MyInfo.';
      ref.componentInstance.isError = true;
      ref.result.then(() => {
        this.myInfoService.goToMyInfo();
      }).catch((e) => {
      });
    }
  }

  openModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('Leave This Page');
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorMessage = this.translate.instant('You will be redirected to Singpass MyInfo page to begin fetching your data.');
    ref.componentInstance.isButtonEnabled = true;
    ref.result.then(() => {
      // tslint:disable-next-line:max-line-length
      //const myInfoAttributes = 'name,sex,race,nationality,dob,email,mobileno,regadd,housingtype,hdbtype,marital,edulevel,assessableincome,ownerprivate,assessyear,cpfcontributions,cpfbalances,passportnumber,passportexpirydate,mailadd,occupation,employment,householdincome';
      const myInfoAttributes = 'cpfbalances';
      if (this.project === 'robo2') {
        const myInfoAttributes1 = ['nationality', 'name', 'passportnumber', 'passportexpirydate',
        'dob', 'sex', 'regadd', 'mailadd', 'employment', 'occupation', 'householdincome'];
        this.myInfoService.setMyInfoAttributes(myInfoAttributes1);
      } else {
        this.myInfoService.setMyInfoAttributes(myInfoAttributes);
      }
      this.myInfoService.goToMyInfo();
    }).catch((e) => {
    });

  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

}
