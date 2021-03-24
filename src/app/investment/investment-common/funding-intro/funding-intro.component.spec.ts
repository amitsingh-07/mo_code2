import { Injector } from '@angular/core';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import {  Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { concat, Observable, of, throwError } from 'rxjs';

import {
  AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import {
  MANAGE_INVESTMENTS_ROUTE_PATHS
} from '../../manage-investments/manage-investments-routes.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { FundingIntroComponent } from './funding-intro.component';

describe('FundingIntroComponent', () => {
  let component: FundingIntroComponent;
  let fixture: ComponentFixture<FundingIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
