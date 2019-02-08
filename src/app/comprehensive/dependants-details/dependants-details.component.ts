import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-dependants-details',
  templateUrl: './dependants-details.component.html',
  styleUrls: ['./dependants-details.component.scss']
})
export class DependantsDetailsComponent implements OnInit {
  myDependantForm: FormGroup;
  formName: string[] = [];
  pageTitle: string;
  dependant: any = [];
  relationShipList: any;
  nationalityList: any;
  relationship;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');
      this.relationShipList = this.translate.instant('DEPENDANT_DETAILS.RELATIONSHIP_LIST');
      this.nationalityList = this.translate.instant('NATIONALITY');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.buildDependantForm();
  }

  buildDependantForm() {
    this.myDependantForm = this.formBuilder.group({
      dependant: this.formBuilder.array([this.buildDependantDetailsForm()]),

    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  selectRelationship(status, i) {
const relationship = status ? status : '';
this.myDependantForm.controls['dependant']['controls'][i].controls.relationship.setValue(relationship);

  }
  selectNationality(status, i) {
    const nationality = status ? status : '';
    console.log(status, i);
    this.myDependantForm.controls['dependant']['controls'][i].controls.nationality.setValue(nationality);
  }

  buildDependantDetailsForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      relationship: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      nationality: ['', [Validators.required]]

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
  goToNext(form) {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION]);
  }
}
