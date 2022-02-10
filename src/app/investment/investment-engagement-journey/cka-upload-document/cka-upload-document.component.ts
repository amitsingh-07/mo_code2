import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { UploadDocumentService } from '../../../shared/Services/upload-document.service';

import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';

import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../../investment/investment-account/investment-account.constant';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../../investment-common/investment-common.constants';
@Component({
  selector: 'app-cka-upload-document',
  templateUrl: './cka-upload-document.component.html',
  styleUrls: ['./cka-upload-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CkaUploadDocumentComponent implements OnInit {
  defaultThumb: any;
  ckaDocumentInfo: any;
  streamResponse: any;
  pageTitle: string;
  showTnc = false;
  saveAndContinue = false;
  certificateName: String;

  ckaUploadForm: FormGroup;
  formData: FormData = new FormData();

  constructor(public readonly translate: TranslateService,
    public modal: NgbModal,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public investmentAccountService: InvestmentAccountService,
    public investmentCommonService: InvestmentCommonService,
    public uploadDocumentService: UploadDocumentService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('NONE_OF_THE_ABOVE.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
      this.certificateName = this.translate.instant('UPLOAD_DOCUMENTS.CKA_CERTIFICATE');
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);

    this.buildDocumentInfo();
    this.buildForm();
    this.getCKADocumentFromS3();
  }

  private buildDocumentInfo() {
    this.defaultThumb = INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.default_cka_thumb;

    this.ckaDocumentInfo = {
      documentType: this.certificateName,
      defaultThumb: this.defaultThumb,
      formData: this.formData
    };
  }

  private buildForm() {
    this.ckaUploadForm = this.formBuilder.group({
      ckaDoc: this.formBuilder.group({
        document: ['', Validators.required]
      })
    });
  }

  private getCKADocumentFromS3() {
    const ckaStatus = this.investmentCommonService.getCKAStatus();
    if (ckaStatus && ckaStatus != INVESTMENT_COMMON_CONSTANTS.CKA.CKA_REJECTED_STATUS) {
      this.investmentCommonService.getCKADocument(this.certificateName).subscribe((response: any) => {
        if (response && response.body && response.body.type && response.body.type.split('/')[1].toLowerCase() != 'json') {
          this.uploadDocumentService.setStreamResponse(response);
        }
      });
    }
  }

  private addTncControllToForm() {
    this.showTnc = true;
    this.ckaUploadForm.addControl('tncCheckboxFlag', this.formBuilder.control('', Validators.requiredTrue));
  }

  private removeTncControllToForm() {
    this.showTnc = false;
    this.ckaUploadForm.removeControl('tncCheckboxFlag');
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  reselect() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_ASSESSMENT]);
  }

  goToNext() {
    if (this.saveAndContinue) {
      const redirectURL = this.investmentCommonService.getCKARedirectFromLocation();
      this.investmentCommonService.setCKARedirectFromLocation(null);
      this.router.navigate([redirectURL]);
    }

    if (this.ckaUploadForm.valid && !this.saveAndContinue) {
      this.uploadDocument();
    }
  }

  eventTriggered(event) {
    if (event && event.clearBtn && this.ckaUploadForm.controls.tncCheckboxFlag) {
      this.removeTncControllToForm();
      this.saveAndContinue = false;
    }
  }

  uploadDocument() {
    this.loaderService.showLoader({
      title: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.TITLE'),
      desc: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.MESSAGE')
    });

    if (this.formData) {
      this.investmentEngagementJourneyService.uploadDocument(this.formData).subscribe((response) => {
        this.loaderService.hideLoader();
        if (response && response.objectList &&
          response.objectList.length &&
          response.objectList[response.objectList.length - 1].responseInfo) {
          this.gentleReminderPopup();
        }
      }, (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
    }
  }

  private gentleReminderPopup() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorTitle = this.translate.instant('CKA_UPLOAD_DOCUMENT.GENTLE_REMINDER_TITLE');
    ref.componentInstance.errorMessageHTML = this.translate.instant('CKA_UPLOAD_DOCUMENT.GENTLE_REMINDER_DESC');
    ref.componentInstance.primaryActionLabel = this.translate.instant('UPLOAD_DOCUMENTS.OKAY_GOT_IT_BTN');
    ref.componentInstance.closeBtn = false;
    ref.componentInstance.primaryAction.subscribe(() => {
      this.addTncControllToForm();
      this.saveAndContinue = true;
    });
  }
}
