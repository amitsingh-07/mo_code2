import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { IMyDependant } from './../comprehensive-types';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependants-details',
  templateUrl: './dependants-details.component.html',
  styleUrls: ['./dependants-details.component.scss']
})
export class DependantsDetailsComponent implements OnInit, OnDestroy {
  myDependantForm: FormGroup;
  formName: string[] = [];
  pageTitle: string;
  dependant: any = [];
  relationShipList: any;
  nationalityList: any;
  dependantDetails: IMyDependant[];
  relationship: string;
  submitted: boolean;
  pageId: string;
  menuClickSubscription: Subscription;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private parserFormatter: NgbDateParserFormatter) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.relationShipList = this.translate.instant('CMP.DEPENDANT_DETAILS.RELATIONSHIP_LIST');
        this.nationalityList = this.translate.instant('CMP.NATIONALITY');
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });
    this.comprehensiveApiService.getDependents().subscribe((data) => {
    this.dependantDetails = data.objectList;
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildDependantForm();
  }

  ngOnDestroy() {
    this.menuClickSubscription.unsubscribe();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  buildDependantForm() {
    this.myDependantForm = this.formBuilder.group({
      dependant: this.formBuilder.array([this.buildDependantDetailsForm()]),

    });
  }

  selectRelationship(status, i) {
    const relationship = status ? status : '';
    this.myDependantForm.controls['dependant']['controls'][i].controls.relationship.setValue(relationship);

  }
  selectNationality(status, i) {
    const nationality = status ? status : '';
    this.myDependantForm.controls['dependant']['controls'][i].controls.nation.setValue(nationality);
  }

  buildDependantDetailsForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100),
      Validators.pattern(RegexConstants.NameWithSymbol)]],
      relationship: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      nation: ['', [Validators.required]]

    });
  }
  addDependant() {
    const dependantdetails = this.myDependantForm.get('dependant') as FormArray;
    dependantdetails.push(this.buildDependantDetailsForm());
  }
  removeDependant(i) {
    const dependantdetails = this.myDependantForm.get('dependant') as FormArray;
    dependantdetails.removeAt(i);
  }
  validateDependantform(form: FormGroup) {

    this.submitted = true;
    if (!form.valid) {
      const error = this.comprehensiveService.getMultipleFormError(form, COMPREHENSIVE_FORM_CONSTANTS.dependantForm,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.DEPENDANT_DETAIL'));
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, true,
      );
      return false;
    }
    return true;
  }
  goToNext(form: FormGroup) {
    if (this.validateDependantform(form)) {
      form.value.dependant.forEach((dependant: any, index) => {
        form.value.dependant[index].dateOfBirth = this.parserFormatter.format(dependant.dateOfBirth);
        form.value.dependant[index].enquiryId = 1;
      });
      console.log(form.value);
      this.comprehensiveApiService.addDependents(form.value.dependant).subscribe((data) => {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION]);
      });

    }
  }
}
