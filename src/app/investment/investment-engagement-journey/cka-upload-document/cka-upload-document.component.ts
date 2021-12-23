import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';

import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';

import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../../investment/investment-account/investment-account.constant';
import { UploadDocumentService } from '../../../shared/Services/upload-document.service';
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
  ckaUploadForm: FormGroup;
  formData: FormData = new FormData();

  constructor(public readonly translate: TranslateService,
    public modal: NgbModal,
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
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);

    this.buildDocumentInfo();
    this.buildForm();

    this.investmentCommonService.getCKADocument("CKA_CERTIFICATE").subscribe((response) => {
      if (response) {
        this.uploadDocumentService.setStreamResponse(response);
      }
    });
  }

  private buildDocumentInfo() {
    this.defaultThumb = INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.default_cka_thumb;

    this.ckaDocumentInfo = {
      documentType: 'CKA_CERTIFICATE',
      defaultThumb: this.defaultThumb,
      formData: this.formData
    };
  }

  private buildForm() {
    this.ckaUploadForm = this.formBuilder.group({
      ckaDoc: this.formBuilder.group({
        document: ['', Validators.required]
      }),
      tncCheckboxFlag: ['']
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToNext() {
    if (this.ckaUploadForm.valid) {
      this.uploadDocument();
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

          const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
          ref.componentInstance.imgType = 1;
          ref.componentInstance.errorTitle = "Gentle Reminder";
          ref.componentInstance.errorMessageHTML = "Please ensure that you have uploaded the correct file as it may causes delays in creating your portfolio. Congratulations on completing your e-Learning!";
          ref.componentInstance.primaryActionLabel = this.translate.instant('UPLOAD_DOCUMENTS.OKAY_GOT_IT_BTN');

          ref.componentInstance.primaryAction.subscribe(() => {
            console.log('got it');
          });

        }
      }, (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
    }
  }
}
