import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { RouterTestingModule} from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { tokenGetterFn } from 'src/app/app.module';
import { AccountStatusComponent } from './account-status.component';

describe('AccountStatusComponent', () => {
  let component: AccountStatusComponent;
  let fixture: ComponentFixture<AccountStatusComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule.forRoot(), HttpClientTestingModule, HttpModule,
         JwtModule.forRoot({config: {}})],
      declarations: [AccountStatusComponent],
      providers: [NgbActiveModal, JwtHelperService, { provide: Router, useValue: routerSpy }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AccountStatusComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to Dashboard', () => {
    component.redirectToDashboard();
    expect(routerSpy).toHaveBeenCalledWith(['../accounts/dashboard']);
  });
});
