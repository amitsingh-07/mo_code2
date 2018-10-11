import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IMyFamily, ISpouse } from '../will-writing-types';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-my-family',
  templateUrl: './my-family.component.html',
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
  styleUrls: ['./my-family.component.scss']
})
export class MyFamilyComponent implements OnInit {

  private pageTitle;

  myFamilyForm: FormGroup;
  familyFormValues: IMyFamily;
  childrenCount: number;
  childrenArr: FormArray;

  constructor(
    private config: NgbDatepickerConfig,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private parserFormatter: NgbDateParserFormatter,
    private router: Router,
    private translate: TranslateService,
    private willWritingService: WillWritingService
  ) {
    const today: Date = new Date();
    config.minDate = { year: (today.getFullYear() - 100), month: (today.getMonth() + 1), day: today.getDate() };
    config.maxDate = { year: today.getFullYear(), month: (today.getMonth() + 1), day: today.getDate() };
    config.outsideDays = 'collapsed';
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_FAMILY.TITLE');
    });
  }

  ngOnInit() {
    this.buildMyFamilyForm();
  }

  /**
   * build about me form.
   */
  buildMyFamilyForm() {
    this.familyFormValues = this.willWritingService.getMyFamilyInfo();
    this.childrenCount = this.willWritingService.getAboutMeInfo().noOfChildren;
    this.myFamilyForm = this.formBuilder.group({
      name: [this.familyFormValues.spouse.name, [Validators.required]],
      nricNumber: [this.familyFormValues.spouse.nricNumber, [Validators.required]],
      childrens: this.formBuilder.array([ this.buildChildrenForm() ]),
    });
  }

  buildChildrenForm(): FormGroup {
    return this.formBuilder.group({
        name: ['', [Validators.required]],
        nricNumber: ['', [Validators.required]],
        dob: ['', [Validators.required]]
    });
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
   * redirect to next page.
   * @param form - aboutMeForm.
   */
  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_FAMILY]);
    }
  }

}
