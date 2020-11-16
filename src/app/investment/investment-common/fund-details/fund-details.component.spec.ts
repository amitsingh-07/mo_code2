import { Injector } from '@angular/core';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {  Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from '../../../sign-up/sign-up.constant';
import { Location } from '@angular/common';

import {  FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';


import { InvestmentEngagementJourneyService } from '../../investment-engagement-journey/investment-engagement-journey.service';

import { FundDetailsComponent } from './fund-details.component';

describe('FundDetailsComponent', () => {
  let component: FundDetailsComponent;
  let fixture: ComponentFixture<FundDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
