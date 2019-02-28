import { Component, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
  endowmentListForm: FormGroup;
  endowmentArrayPlan: any;
  endowmentPlan: any = [];
  endowmentSkipEnable = true;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService, private comprehensiveService: ComprehensiveService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('DEPENDANT_EDUCATION.TITLE');

      this.setPageTitle(this.pageTitle);
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
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
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
  showToolTipModal(){
    let toolTipParams = { TITLE: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_TITLE'), 
    DESCRIPTION: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_MESSAGE')};
    this.comprehensiveService.openTooltipModal(toolTipParams);
    console.log(this.endowmentSkipEnable);    
  }

  @HostListener('input', ['$event'])
  onChange() {
    this.checkDependantCheck();
  }

  checkDependantCheck(){
      this.endowmentListForm.valueChanges.subscribe(form => { 
        let endowmentSkipEnableFlag = true;
        form.endowmentPlan.forEach((dependant: any, index) => {                
          if(dependant.endowmentplanShow == true)
            endowmentSkipEnableFlag = false;        
        });
        this.endowmentSkipEnable = endowmentSkipEnableFlag;
      });
  }
}
