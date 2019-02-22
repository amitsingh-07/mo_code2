import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-dependant-education',
  templateUrl: './dependant-education.component.html',
  styleUrls: ['./dependant-education.component.scss']
})
export class DependantEducationComponent implements OnInit {
  pageTitle: string;
  educationPlanOption: any;
  dependantEducationSelectionForm: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('CMP.DEPENDANT_EDUCATION.TITLE');
      this.educationPlanOption = this.translate.instant('CMP.DEPENDANT_EDUCATION.OPTIONS');

      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.buildDependantForm();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  buildDependantForm() {

    this.dependantEducationSelectionForm = new FormGroup({
      dependant_selection: new FormControl('', Validators.required)
    });
  }
  goToNext() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE]);
  }
}
