import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { FooterService } from '../../shared/footer/footer.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { PageTitleComponent } from '../page-title/page-title.component';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IGuardian } from '../will-writing-types';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-child-guardian',
  templateUrl: './my-child-guardian.component.html',
  styleUrls: ['./my-child-guardian.component.scss']
})
export class MyChildGuardianComponent implements OnInit, OnDestroy {
  @ViewChild(PageTitleComponent) pageTitleComponent: PageTitleComponent;
  pageTitle: string;
  step: string;
  tooltip = {};
  isEdit: boolean;
  private selectedIndex: number;
  private subscription: Subscription;
  private confirmModal = {};

  addGuardianForm: FormGroup;
  guardianList: IGuardian[] = [];
  relationship = '';
  relationshipList;
  submitted: boolean;
  willWritingConfig = WILL_WRITING_CONFIG;

  hasSpouse = this.willWritingService.getAboutMeInfo().maritalStatus === WILL_WRITING_CONFIG.MARRIED;
  maxGuardian: number;
  unsavedMsg: string;
  toolTip;
  formName: string;

  fromConfirmationPage = this.willWritingService.fromConfirmationPage;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private router: Router,
    private translate: TranslateService,
    public footerService: FooterService,
    public navbarService: NavbarService,
    private _location: Location,
    private willWritingService: WillWritingService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_1');
      this.pageTitle = this.hasSpouse ? this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.TITLE_SPOUSE') :
        this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.TITLE');
      this.relationshipList = this.translate.instant('WILL_WRITING.COMMON.RELATIONSHIP_LIST');
      this.tooltip['title'] = this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.TOOLTIP_TITLE');
      this.tooltip['message'] = this.translate.instant('WILL_WRITING.MY_CHILDS_GUARDIAN.TOOLTIP_MESSAGE');
      this.confirmModal['hasNoImpact'] = this.translate.instant('WILL_WRITING.COMMON.CONFIRM');
      this.unsavedMsg = this.translate.instant('WILL_WRITING.COMMON.UNSAVED');
      this.toolTip = this.translate.instant('WILL_WRITING.COMMON.ID_TOOLTIP');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    if (this.willWritingService.getGuardianInfo().length > 0) {
      this.guardianList = this.willWritingService.getGuardianInfo();
    } else {
      if (this.hasSpouse) {
        const spouse: any = Object.assign({}, this.willWritingService.getSpouseInfo()[0]);
        spouse.isAlt = false;
        this.guardianList.push(spouse);
      }
    }
    this.maxGuardian = this.hasSpouse ? 2 : 1;
    this.buildAddGuardianForm();
    this.headerSubscription();
    this.footerService.setFooterVisibility(false);
    this.formName = this.hasSpouse ? 'Alternative Guardian' : 'Guardian';
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  headerSubscription() {
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        if (this.addGuardianForm.dirty) {
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

  get addGud() { return this.addGuardianForm.controls; }

  /**
   * build about me form.
   */
  buildAddGuardianForm() {
    this.addGuardianForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100),
      Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: ['', [Validators.required]],
      uin: ['', [Validators.required]]
    });
  }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectRelationship(relationship) {
    relationship = relationship ? relationship : { text: '', value: '' };
    this.relationship = relationship.text;
    this.addGuardianForm.controls['relationship'].setValue(relationship.value);
    this.addGuardianForm.markAsDirty();
  }

  editGuardian(relation: string, index: number) {
    if (relation === WILL_WRITING_CONFIG.SPOUSE) {
      if (this.addGuardianForm.dirty) {
        this.pageTitleComponent.goBack(WILL_WRITING_ROUTE_PATHS.MY_FAMILY);
      } else {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_FAMILY]);
      }
    } else {
      this.selectedIndex = index;
      this.isEdit = true;
      const guardian = this.guardianList[index];
      this.addGuardianForm.controls['name'].setValue(guardian.name);
      this.addGuardianForm.controls['uin'].setValue(guardian.uin);
      const beneRelationship = this.relationshipList.filter((relationship) => relationship.value === guardian.relationship);
      this.selectRelationship(beneRelationship[0]);
    }
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  validateGuardianForm(form: any): boolean {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'guardBeneForm');
      this.willWritingService.openErrorModal(error.title, error.errorMessages, false, this.formName);
      return false;
    }
    return true;
  }

  checkUin(form) {
    if (this.hasSpouse) {
      let members = [];
      const spouse: any = this.willWritingService.getSpouseInfo();
      members = [...spouse, ...form.value];
      return this.willWritingService.checkDuplicateUin(members);
    } else {
      return true;
    }
  }

  save(form) {
    if (!this.isEdit) {
      form.value.isAlt = this.hasSpouse ? true : false;
      this.guardianList.push(form.value);
    } else {
      this.guardianList[this.selectedIndex].name = form.value.name;
      this.guardianList[this.selectedIndex].relationship = form.value.relationship;
      this.guardianList[this.selectedIndex].uin = form.value.uin;
    }
    this.willWritingService.setGuardianInfo(this.guardianList);
    return true;
  }

  resetForm() {
    this.addGuardianForm.reset();
    this.submitted = false;
    this.relationship = '';
    this.isEdit = false;
  }

  openToolTipModal() {
    const title = this.tooltip['title'];
    const message = this.tooltip['message'];
    this.willWritingService.openToolTipModal(title, message);
  }

  openToolTip() {
    this.willWritingService.openToolTipModal(this.toolTip.TITLE, this.toolTip.MESSAGE);
  }

  openConfirmationModal(url: string, form: any) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.hasImpact = this.confirmModal['hasNoImpact'];
    ref.componentInstance.unSaved = true;
    ref.result.then((data) => {
      if (data === 'yes') {
        this.save(form);
        this.router.navigate([url]);
      }
    });
    return false;
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    const url = this.fromConfirmationPage ? WILL_WRITING_ROUTE_PATHS.CONFIRMATION : WILL_WRITING_ROUTE_PATHS.DISTRIBUTE_YOUR_ESTATE;
    if (this.guardianList.length !== this.maxGuardian) {
      if (this.validateGuardianForm(form) && this.checkUin(form) && this.save(form)) {
        this.router.navigate([url]);
      }
    } else {
      if (this.isEdit) {
        if (this.addGuardianForm.dirty) {
          if (this.validateGuardianForm(form) && this.checkUin(form)) {
            this.openConfirmationModal(url, form);
          }
        } else {
          this.router.navigate([url]);
        }
      } else {
        this.router.navigate([url]);
      }
    }
  }
}
