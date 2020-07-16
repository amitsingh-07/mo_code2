import { Injector } from '@angular/core';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { concat, Observable, of, throwError } from 'rxjs';
import 'rxjs/add/observable/of';

import { CurrencyPipe } from '@angular/common';
import { appConstants } from '../../../app.constants';



import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentApiService } from '../../investment-api.service';

import { AppService } from './../../../app.service';
import { LoaderService } from './../../../shared/components/loader/loader.service';
import { ApiService } from './../../../shared/http/api.service';
import { AuthenticationService } from './../../../shared/http/auth/authentication.service';

import { InvestmentTitleBarComponent } from '../../../shared/components/investment-title-bar/investment-title-bar.component';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';


import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';

import { AddPortfolioNameComponent } from './add-portfolio-name.component';


import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from '../../../sign-up/sign-up.constant';
import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../investment-account/investment-account.constant';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import { IToastMessage } from '../../manage-investments/manage-investments-form-data';
import {
    MANAGE_INVESTMENTS_ROUTE_PATHS
} from '../../manage-investments/manage-investments-routes.constants';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import {
    AccountCreationErrorModalComponent
} from '../confirm-portfolio/account-creation-error-modal/account-creation-error-modal.component';
import { IAccountCreationActions } from '../investment-common-form-data';
import { InvestmentCommonService } from '../investment-common.service';

describe('AddPortfolioNameComponent', () => {
  let component: AddPortfolioNameComponent;
  let fixture: ComponentFixture<AddPortfolioNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPortfolioNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPortfolioNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
