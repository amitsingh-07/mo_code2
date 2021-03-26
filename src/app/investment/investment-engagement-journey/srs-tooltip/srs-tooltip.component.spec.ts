

import { SrsTooltipComponent } from './srs-tooltip.component';
import { IntroScreenComponent } from '../intro-screen/intro-screen.component';
import { async, ComponentFixture, TestBed,getTestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';


import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd} from '@angular/router';

import { filter } from 'rxjs/operators';

describe('SrsTooltipComponent', () => {
  let component: SrsTooltipComponent;
  let fixture: ComponentFixture<SrsTooltipComponent>;
  let router: Router;
 
  let translateService: TranslateService
  let injector: Injector;
  let activeModal :NgbActiveModal;
  let translations = require('../../../../assets/i18n/investment-engagement-journey/en.json');
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrsTooltipComponent ],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]),
      ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
    providers: [NgbActiveModal],

  })
    .compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrsTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = getTestBed();
    activeModal= TestBed.get(NgbActiveModal);
    router = TestBed.get(Router);
    translateService = TestBed.get(TranslateService);
    translateService = injector.get(TranslateService);
    translateService.setTranslation('en', translations);
    translateService.use('en');
    fixture.detectChanges();
   
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
   component.ngOnInit();
  });
});
