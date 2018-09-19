import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';


@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements IPageComponent, OnInit {
  pageTitle: string;
  invPersonalInfoForm: FormGroup;
  formValues: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public headerService: HeaderService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PERSONAL_INFO.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.invPersonalInfoForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      firstName: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      lastName: ['', [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      nricNumber: ['', Validators.required],
      passportNumber: ['', [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      passportExpiry: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['male', Validators.required]
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  save(form: any) {
    if (!form.valid) {
      return false;
    }
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.RESIDENTIAL_ADDRESS]);
    }
  }
}
