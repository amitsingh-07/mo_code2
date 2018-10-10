import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IAboutMe } from '../will-writing-types';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  pageTitle: string;

  aboutMeForm: FormGroup;
  formValues: IAboutMe;
  maritalStatus = '';
  noOfChildren = '';
  maritalStatusList;
  noOfChildrenList: number[] = Array(WILL_WRITING_CONFIG.MAX_CHILDREN_COUNT).fill(1).map((x, i) => x += i * 1);

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public navbarService: NavbarService,
    private router: Router,
    private translate: TranslateService,
    private willWritingService: WillWritingService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WILL_WRITING.ABOUT_ME.TITLE');
      this.maritalStatusList = this.translate.instant('WILL_WRITING.ABOUT_ME.FORM.MARITAL_STATUS_LIST');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.buildAboutMeForm();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  /**
   * build about me form.
   */
  buildAboutMeForm() {
    this.formValues = this.willWritingService.getAboutMeInfo();
    this.aboutMeForm = this.formBuilder.group({
      name: [this.formValues.name, [Validators.required]],
      nricNumber: [this.formValues.nricNumber, [Validators.required]],
      gender: [this.formValues.gender, [Validators.required]],
      maritalStatus: [this.formValues.maritalStatus, [Validators.required]],
      noOfChildren: [this.formValues.noOfChildren, [Validators.required]]
    });
    if (this.formValues.maritalStatus !== undefined) {
      const index = this.maritalStatusList.findIndex((status) => status.value === this.formValues.maritalStatus);
      this.selectMaritalStatus(index);
    }
    if (this.formValues.noOfChildren !== undefined) {
      this.selectNoOfChildren(this.formValues.noOfChildren);
    }
  }

  /**
   * validate aboutMeForm.
   * @param form - user personal detail.
   */
  save(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.willWritingService.getFormError(form, 'aboutMeForm');
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.willWritingService.setAboutMeInfo(form.value);
      return true;
    }
  }

  /**
   * set marital status.
   * @param index - marital Status List index.
   */
  selectMaritalStatus(index: number) {
    this.maritalStatus = this.maritalStatusList[index].value;
    this.aboutMeForm.controls['maritalStatus'].setValue(this.maritalStatus);
  }

  /**
   * set no of childrens.
   * @param children - no of children count.
   */
  selectNoOfChildren(children: any) {
    this.noOfChildren = children;
    this.aboutMeForm.controls['noOfChildren'].setValue(this.noOfChildren);
  }

  /**
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_FAMILY]);
    }
  }

}
