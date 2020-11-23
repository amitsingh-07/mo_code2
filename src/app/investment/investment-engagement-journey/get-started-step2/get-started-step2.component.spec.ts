import { GetStartedStep2Component } from './get-started-step2.component';
import { IntroScreenComponent } from '../intro-screen/intro-screen.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import { TranslateService } from '@ngx-translate/core';

describe('GetStartedStep2Component', () => {
  let component: GetStartedStep2Component;
  let fixture: ComponentFixture<GetStartedStep2Component>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let translateService: TranslateService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetStartedStep2Component, IntroScreenComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]),
        ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      providers: [NgbActiveModal],

    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedStep2Component);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    translateService = TestBed.get(TranslateService);
    const translations = {
      GETSTARTED_STEP2: {
        TITLE: 'Step 2',
        CAPTION: 'Your Risk Willingness',
        // tslint:disable-next-line: max-line-length
        DESCRIPTION: 'In the next step, we will assess your willingness to take risk based on your answers selected for the questionnaire. Your inputs will determine the recommendations suggested.'
      },
      GETSTARTED_STEP1: {

        PROCEED: 'Proceed'
      },
    };
    translateService.setTranslation('en', translations);
    fixture = TestBed.createComponent(GetStartedStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create GetStarted Screen', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });


  it('should call go back', () => {
    component.goBack();
  });

  it('should call go next', () => {
    spyOn(router, 'navigate');
    component.goNext();
    expect(router.navigate).toHaveBeenCalledWith([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.RISK_ASSESSMENT]);
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);

  });


  it('should create GetStarted Screen title', () => {
    expect(component.title).toBe('Step 2');
    expect(component.description).toBe('Your Risk Willingness');
    expect(component.description2).toBe('In the next step, we will assess your willingness to take risk based on your answers selected for the questionnaire. Your inputs will determine the recommendations suggested.');
  });


});
