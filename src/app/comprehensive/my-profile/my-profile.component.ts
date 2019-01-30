import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  pageTitle: string;
  myProfileForm: FormGroup;
  nationality = '';
  nationalityList: string ;

  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');
      this.nationalityList = this.translate.instant('NATIONALITY');
      this.setPageTitle(this.pageTitle);
    });

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.buildMyProfileForm();
  }
  buildMyProfileForm() {
    this.myProfileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      gender: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      age: ['', [Validators.required]],

    });
  }
  goToNext(profileForm) {
console.log(profileForm);
  }
  selectNationality(nationality) {
    nationality = nationality ? nationality : { text: '', value: '' };
    this.nationality = nationality.text;
    this.myProfileForm.controls['nationality'].setValue(nationality.value);
    this.myProfileForm.markAsDirty();
  }
}
