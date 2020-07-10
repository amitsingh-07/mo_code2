import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingMethodComponent } from './funding-method.component';
import { Injector } from '@angular/core';
import {fakeAsync, getTestBed, inject, tick } from '@angular/core/testing';
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
export class TestComponent {
}

export class RouterStub {
  public url: string = INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.FUNDING_METHOD;
  constructor() { }
  navigate(url: any) {
    return this.url = url;
  }
}
export const routes: Routes = [
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.ROOT,
    redirectTo: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.FUNDING_METHOD,
    pathMatch: 'full',
    component: TestComponent
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.GET_STARTED_STEP1,
    component: TestComponent
  },
]
describe('FundingMethodComponent', () => {
  let component: FundingMethodComponent;
  let fixture: ComponentFixture<FundingMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});