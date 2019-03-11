import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterService } from '../../shared/footer/footer.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PageTitleComponent } from '../page-title/page-title.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-my-estate-distribution',
  templateUrl: './my-estate-distribution.component.html',
  styleUrls: ['./my-estate-distribution.component.scss']
})
export class MyEstateDistributionComponent implements OnInit, OnDestroy {
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;
  private subscription: Subscription;
  private confirmModal = {};
  pageTitle: string;
  step: string;

  beneficiaryList: any[] = [];
  distributionForm: FormGroup;
  remainingPercentage = 100;
  value = '';
  showForm = false;
  divider: number;
  distPercentageSum = 0;
  firstReset = false;
  isFormAltered = false;
  currentDist;
  errorMsg;
  filteredList;
  fromConfirmationPage = this.willWritingService.fromConfirmationPage;

  constructor(
    private translate: TranslateService,
    private willWritingService: WillWritingService,
    private formBuilder: FormBuilder,
    private _location: Location,
    private modal: NgbModal,
    public footerService: FooterService,
    public navbarService: NavbarService,
    private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_2');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_ESTATE_DISTRIBUTION.TITLE');
      this.confirmModal['hasNoImpact'] = this.translate.instant('WILL_WRITING.COMMON.CONFIRM');
      this.errorMsg = this.translate.instant('WILL_WRITING.MY_ESTATE_DISTRIBUTION.ERROR_MODAL');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    if (this.willWritingService.getBeneficiaryInfo().length > 0) {
      this.beneficiaryList = this.willWritingService.getBeneficiaryInfo();
    }
    this.buildBeneficiaryForm();
    this.calculateRemPercentage();
    this.headerSubscription();
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.distributionForm.dirty) {
          this.pageTitleComponent.goBack();
        } else {
          this._location.back();
        }
        return false;
      }
    });
  }

  buildBeneficiaryForm() {
    this.distributionForm = this.formBuilder.group({
      percent: ['', [Validators.required]]
    });
  }

  calculateRemPercentage() {
    for (const percent of this.beneficiaryList) {
      this.remainingPercentage = (this.remainingPercentage - percent.distPercentage);
    }
    return this.remainingPercentage;
  }

  updateDistPercentage(index: number, event) {
    for (const percent of this.beneficiaryList) {
      this.beneficiaryList[index].distPercentage = Math.floor(event.target.value);
      this.distPercentageSum += percent.distPercentage;
    }
    if (this.beneficiaryList[index].distPercentage < 0 || this.beneficiaryList[index].distPercentage > 100) {
      this.currentDist = this.beneficiaryList[index].distPercentage;
      setTimeout(() => this.beneficiaryList[index].distPercentage = 0, 0);
      this.willWritingService.openToolTipModal(this.errorMsg.MIN_ERROR, '');
      this.distPercentageSum = 0;
      for (const percent of this.beneficiaryList) {
        this.distPercentageSum += percent.distPercentage;
      }
      this.remainingPercentage = 100 - (this.distPercentageSum - this.beneficiaryList[index].distPercentage);
    } else {
      this.remainingPercentage = 100 - this.distPercentageSum;
    }
    this.distPercentageSum = 0;
    this.isFormAltered = true;
  }

  calcAfterReset() {
    this.remainingPercentage = 100 - this.distPercentageSum;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
  }

  openConfirmationModal(title: string, message: string, url: string, hasImpact: boolean) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.hasImpact = this.confirmModal['hasNoImpact'];
    ref.componentInstance.unSaved = true;
    ref.result.then((data) => {
      if (data === 'yes') {
        this.save(url);
      }
    });
    return false;
  }

  validateBeneficiaryForm() {
    const estateDistList = this.beneficiaryList.filter((checked) => checked.selected === true);
    const filteredArr = estateDistList.filter((greater) => greater.distPercentage < 1);
    const joinedArray = [];
    if (this.remainingPercentage < 0) {
      this.willWritingService.openToolTipModal(this.errorMsg.MAX_PERCENTAGE, '');
      return false;
    } else if (this.remainingPercentage !== 0 && filteredArr.length < 1) {
      this.willWritingService.openToolTipModal(this.errorMsg.ADJUST_PERCENTAGE, '');
      return false;
    } else if (filteredArr.length > 0) {
      this.willWritingService.openToolTipModal(this.errorMsg.NON_ALLOCATED_PERCENTAGE, '');
      return false;
    }
    return true;
  }

  save(url) {
    this.willWritingService.setBeneficiaryInfo(this.beneficiaryList);
    this.router.navigate([url]);
  }

  goToNext() {
    if (this.validateBeneficiaryForm()) {
      const url = this.fromConfirmationPage ? WILL_WRITING_ROUTE_PATHS.CONFIRMATION : WILL_WRITING_ROUTE_PATHS.APPOINT_EXECUTOR_TRUSTEE;
      if (this.fromConfirmationPage && this.isFormAltered) {
        this.openConfirmationModal(this.confirmModal['title'], this.confirmModal['message'], url,
          this.willWritingService.getIsWillCreated());
      } else if (this.fromConfirmationPage) {
        this.save(url);
      } else {
        this.save(url);
      }
    }
  }

}
