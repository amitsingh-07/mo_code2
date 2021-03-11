import { IntroScreenComponent } from '../intro-screen/intro-screen.component';
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
describe('IntroScreenComponent', () => {
  let component: IntroScreenComponent;
  let fixture: ComponentFixture<IntroScreenComponent>;
  let translateService: TranslateService
  let injector: Injector;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IntroScreenComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroScreenComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    translateService = TestBed.get(TranslateService);
    translateService = injector.get(TranslateService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
afterEach(() => {
  TestBed.resetTestingModule();
});
