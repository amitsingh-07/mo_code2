import { Component, HostListener, OnInit } from '@angular/core';
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
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependant-education-list',
  templateUrl: './dependant-education-list.component.html',
  styleUrls: ['./dependant-education-list.component.scss']
})
export class DependantEducationListComponent implements OnInit {
  pageTitle: string;
  pageId: string;
  endowmentListForm: FormGroup;
  menuClickSubscription: Subscription;
  endowmentArrayPlan: any;
  endowmentPlan: any = [];
  endowmentSkipEnable = true;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder,
              private configService: ConfigService, private comprehensiveService: ComprehensiveService) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title

        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });

    this.endowmentArrayPlan = [{
      name: 'Nathan Ng',
      age: '2',
      maturityAmount: '',
      maturityYear: '',
      endowmentplanShow: false

    },
    {
      name: 'Marie Ng',
      age: '2',
      maturityAmount: '',
      maturityYear: '',
      endowmentplanShow: false

    }];

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {

      }
    });
    this.buildEndowmentListForm(this.endowmentArrayPlan);

  }
  buildEndowmentListForm(endowmentArrayPlan) {
    const endowmentArray = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < endowmentArrayPlan.length; i++) {
      endowmentArray.push(this.buildEndowmentDetailsForm(endowmentArrayPlan[i]));
    }
    this.endowmentListForm = this.formBuilder.group({
      endowmentPlan: this.formBuilder.array(endowmentArray),

    });

  }
  buildEndowmentDetailsForm(value): FormGroup {

    return this.formBuilder.group({
      name: [value.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      age: [value.age, [Validators.required]],
      maturityAmount: ['', [Validators.required]],
      maturityYear: ['', [Validators.required]],
      endowmentplanShow: [value.endowmentplanShow, [Validators.required]]

    });

  }
  goToNext(form) {

  }
  showToolTipModal() {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_TITLE'),
      DESCRIPTION: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_MESSAGE')
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);

  }

  @HostListener('input', ['$event'])
  onChange() {
    this.checkDependant();
  }

  checkDependant() {
    this.endowmentListForm.valueChanges.subscribe((form: any) => {
      let endowmentSkipEnableFlag = true;
      form.endowmentPlan.forEach((dependant: any, index) => {
        if (dependant.endowmentplanShow) {
          endowmentSkipEnableFlag = false;
        }
      });
      this.endowmentSkipEnable = endowmentSkipEnableFlag;
    });
  }
}
