import { Component, HostListener, OnDestroy, OnInit, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-dependant-education-selection',
  templateUrl: './dependant-education-selection.component.html',
  styleUrls: ['./dependant-education-selection.component.scss']
})
export class DependantEducationSelectionComponent implements OnInit, OnDestroy {

  education_plan_selection = false;
  pageId: string;
  pageTitle: string;
  dependantEducationSelectionForm: FormGroup;
  dependantsArray: any;
  educationPreference = true;
  menuClickSubscription: Subscription;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder,
              private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);

      });
    });
    this.dependantSelection();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {

      }
    });
    this.buildEducationSelectionForm(this.dependantsArray);
  }

  dependantSelection() {
    this.dependantsArray = [{
      name: 'Nathan Ng',
    },
    {
      name: 'Marie Ng',
    }];
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.checkDependant();
  }

  checkDependant() {

    this.dependantEducationSelectionForm.valueChanges.subscribe((form: any) => {
      let educationPreferenceAlert = true;
      form.education_plan_selection === 'no' ? this.education_plan_selection = true : this.education_plan_selection = false;
      form.dependant_list.forEach((dependant: any, index) => {
        dependant.dependantSelection ? educationPreferenceAlert = false : educationPreferenceAlert = true;
      });
      this.educationPreference = educationPreferenceAlert;
    });
  }

  buildEducationSelectionForm(dependantsArray) {
    const dependantListArray = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < dependantsArray.length; i++) {
      dependantListArray.push(this.buildEducationlist(dependantsArray[i]));
    }
    this.dependantEducationSelectionForm = this.formBuilder.group({
      education_plan_selection: ['', Validators.required],
      dependant_list: this.formBuilder.array(dependantListArray)
    });

  }

  buildEducationlist(value) {

    return this.formBuilder.group({
      name: [value.name, [Validators.required]],
      dependantSelection: [true, [Validators.required]],

    });
  }
  goToNext(form) {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE]);
  }
}
