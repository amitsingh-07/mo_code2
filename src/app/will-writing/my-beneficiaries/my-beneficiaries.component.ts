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
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { PageTitleComponent } from '../page-title/page-title.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { IBeneficiary } from './../will-writing-types';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-my-beneficiaries',
  templateUrl: './my-beneficiaries.component.html',
  styleUrls: ['./my-beneficiaries.component.scss']
})
export class MyBeneficiariesComponent implements OnInit, OnDestroy {
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;
  pageTitle: string;
  step: string;
  private minErrorMsg: string;
  isEdit: boolean;
  private selectedIndex: number;
  private confirmModal = {};

  addBeneficiaryForm: FormGroup;
  beneficiaryList: IBeneficiary[] = [];
  relationshipList;
  relationship = '';
  submitted = false;
  isFormOpen = false;
  willWritingConfig = WILL_WRITING_CONFIG;
  maxBeneficiary = WILL_WRITING_CONFIG.MAX_BENEFICIARY;
  private subscription: Subscription;
  unsavedMsg: string;
  isFormAltered = false;
  selectedBeneficiaryLength: number;
  toolTip;

  fromConfirmationPage = this.willWritingService.fromConfirmationPage;

  constructor(
    private translate: TranslateService, private _location: Location,
    private formBuilder: FormBuilder,
    private willWritingService: WillWritingService,
    public footerService: FooterService,
    private modal: NgbModal,
    private router: Router, public navbarService: NavbarService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_2');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_BENEFICIARY.TITLE');
      this.relationshipList = this.translate.instant('WILL_WRITING.COMMON.RELATIONSHIP_LIST');
      this.minErrorMsg = this.translate.instant('WILL_WRITING.MY_BENEFICIARY.MIN_BENEFICIARY');
      this.confirmModal['hasNoImpact'] = this.translate.instant('WILL_WRITING.COMMON.CONFIRM');
      this.confirmModal['hasImpact'] = this.translate.instant('WILL_WRITING.COMMON.CONFIRM_IMPACT_MESSAGE');
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
      this.toolTip = this.translate.instant('WILL_WRITING.COMMON.ID_TOOLTIP');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    const beneficiaryList = this.willWritingService.getBeneficiaryInfo();
    if (beneficiaryList.length > 0) {
      this.beneficiaryList = JSON.parse(JSON.stringify(beneficiaryList));
      this.selectedBeneficiaryLength = this.beneficiaryList.filter((beneficiary) => beneficiary.selected === true).length;
    } else {
      if (this.willWritingService.getSpouseInfo().length > 0) {
        const spouse: any = Object.assign({}, this.willWritingService.getSpouseInfo()[0]);
        spouse.selected = true;
        spouse.distPercentage = 0;
        this.beneficiaryList.push(spouse);
      }
      if (this.willWritingService.getChildrenInfo().length > 0) {
        const children: any = this.willWritingService.getChildrenInfo();
        for (const child of children) {
          child.selected = true;
          child.distPercentage = 0;
          this.beneficiaryList.push(child);
        }
      }
    }
    this.buildBeneficiaryForm();
    this.headerSubscription();
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.addBeneficiaryForm.dirty) {
          this.pageTitleComponent.goBack();
        } else {
          this._location.back();
        }
        return false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
  }

  buildBeneficiaryForm() {
    this.addBeneficiaryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100),
      Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: ['', [Validators.required]],
      uin: ['', [Validators.required]]
    });
  }

  selectRelationship(relationship) {
    relationship = relationship ? relationship : { text: '', value: '' };
    this.relationship = relationship.text;
    this.addBeneficiaryForm.controls['relationship'].setValue(relationship.value);
    this.addBeneficiaryForm.markAsDirty();
  }

  addBeneficiary(form) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'guardBeneForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, false, 'Beneficiary');
    } else {
      if (!this.isEdit) {
        form.value.selected = true;
        form.value.distPercentage = 0;
        this.beneficiaryList.push(form.value);
        this.resetForm();
      } else {
        this.beneficiaryList[this.selectedIndex].name = form.value.name;
        this.beneficiaryList[this.selectedIndex].relationship = form.value.relationship;
        this.beneficiaryList[this.selectedIndex].uin = form.value.uin;
        this.resetForm();
      }
      this.isFormAltered = true;
      this.addBeneficiaryForm.markAsDirty();
    }
  }

  get addBen() { return this.addBeneficiaryForm.controls; }

  resetForm() {
    this.addBeneficiaryForm.reset();
    this.submitted = false;
    this.relationship = '';
    this.isFormOpen = false;
    this.isEdit = false;
  }

  validateForm(index: number) {
    this.beneficiaryList[index].selected = !this.beneficiaryList[index].selected;
    this.isFormAltered = true;
    this.addBeneficiaryForm.markAsDirty();
    if (this.beneficiaryList[index].selected === false) {
      this.beneficiaryList[index].distPercentage = 0;
    }
  }

  editBeneficiary(relation: string, index: number, el) {
    if (relation === WILL_WRITING_CONFIG.SPOUSE || relation === WILL_WRITING_CONFIG.CHILD) {
      if (this.addBeneficiaryForm.dirty) {
        this.pageTitleComponent.goBack(WILL_WRITING_ROUTE_PATHS.MY_FAMILY);
      } else {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_FAMILY]);
      }
    } else {
      this.selectedIndex = index;
      this.isEdit = true;
      this.isFormOpen = true;
      const beneficiary = this.beneficiaryList[index];
      this.addBeneficiaryForm.controls['name'].setValue(beneficiary.name);
      this.addBeneficiaryForm.controls['uin'].setValue(beneficiary.uin);
      const beneRelationship = this.relationshipList.filter((relationship) => relationship.value === beneficiary.relationship);
      this.selectRelationship(beneRelationship[0]);
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }

  getSelectedBeneLength(): number {
    return this.beneficiaryList.filter((checked) => checked.selected === true).length;
  }

  validateBeneficiaryForm() {
    if (this.getSelectedBeneLength() < WILL_WRITING_CONFIG.MIN_BENEFICIARY) {
      this.willWritingService.openToolTipModal(this.minErrorMsg, '');
      return false;
    }
    return true;
  }

  openToolTipModal() {
    this.willWritingService.openToolTipModal(this.toolTip.TITLE, this.toolTip.MESSAGE);
  }

  save(url) {
    this.willWritingService.setBeneficiaryInfo(this.beneficiaryList);
    this.router.navigate([url]);
  }

  openConfirmationModal(url: string, hasImpact: boolean) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.unSaved = true;
    ref.componentInstance.hasImpact = this.confirmModal['hasNoImpact'];
    if (hasImpact) {
      ref.componentInstance.hasImpact = this.confirmModal['hasImpact'];
    }
    ref.result.then((data) => {
      if (data === 'yes') {
        this.save(url);
      }
    });
    return false;
  }

  checkBeneficiaryData() {
    if (this.selectedBeneficiaryLength !== this.getSelectedBeneLength()) {
      return true;
    } else {
      let i = 0;
      let dis = 0;
      for (const beneficiary of this.willWritingService.getBeneficiaryInfo().slice()) {
        if (beneficiary.selected !== this.beneficiaryList[i].selected) {
          return true;
        } else {
          dis += beneficiary.distPercentage;
        }
        i++;
      }
      return dis !== 100;
    }
  }

  goToNext() {
    if (this.validateBeneficiaryForm() && this.willWritingService.checkDuplicateUin(this.beneficiaryList)) {
      let url = this.fromConfirmationPage ? WILL_WRITING_ROUTE_PATHS.CONFIRMATION : WILL_WRITING_ROUTE_PATHS.MY_ESTATE_DISTRIBUTION;
      if (this.willWritingService.getBeneficiaryInfo().length > 0) {
        if (this.checkBeneficiaryData() && this.isFormAltered) {
          url = WILL_WRITING_ROUTE_PATHS.MY_ESTATE_DISTRIBUTION;
          const hasImpact = this.willWritingService.getIsWillCreated();
          this.openConfirmationModal(url, hasImpact);
        } else if (this.isFormAltered) {
          this.openConfirmationModal(url, false);
        } else {
          this.router.navigate([url]);
        }
      } else {
        this.save(url);
      }
    }
  }
}
