

import { GetStartedStep1Component } from './get-started-step1.component';
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
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS,
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES
} from '../investment-engagement-journey-routes.constants';



import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentApiService } from '../../investment-api.service';
import { createTranslateLoader } from '../investment-engagement-journey.module';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { AppService } from './../../../app.service';
import { LoaderService } from './../../../shared/components/loader/loader.service';
import { ApiService } from './../../../shared/http/api.service';
import { AuthenticationService } from './../../../shared/http/auth/authentication.service';

import { InvestmentTitleBarComponent } from '../../../shared/components/investment-title-bar/investment-title-bar.component';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';

describe('GetStartedStep1Component', () => {
  let component: GetStartedStep1Component;
  let fixture: ComponentFixture<GetStartedStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
