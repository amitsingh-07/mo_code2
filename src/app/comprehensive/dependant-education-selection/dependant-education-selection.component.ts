import { Component, OnInit,  } from '@angular/core';
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

@Component({
  selector: 'app-dependant-education-selection',
  templateUrl: './dependant-education-selection.component.html',
  styleUrls: ['./dependant-education-selection.component.scss']
})
export class DependantEducationSelectionComponent implements OnInit {

  pageTitle: string;
  dependantEducationSelectionForm: FormGroup;
  dependantsArray: any;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder,
              private configService: ConfigService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('CMP.DEPENDANT_SELECTION.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.dependantSelection();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
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
      dependantSelection: [false, [Validators.required]],

    });
  }
  goToNext(form) {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE]);
  }
}
