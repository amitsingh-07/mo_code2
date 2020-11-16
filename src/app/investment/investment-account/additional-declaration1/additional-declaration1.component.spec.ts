import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterService } from 'src/app/shared/footer/footer.service';
import { MockInvestmentAccountService } from './../../../../assets/mocks/service/shared-service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from './../investment-account-service';
import { AdditionalDeclaration1Component } from './additional-declaration1.component';

describe('AdditionalDeclaration1Component', () => {
  let component: AdditionalDeclaration1Component;
  let fixture: ComponentFixture<AdditionalDeclaration1Component>;
  let investAccountService: MockInvestmentAccountService;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule, HttpClientTestingModule,
        , FormsModule, ReactiveFormsModule, JwtModule.forRoot({ config: {} })],
      declarations: [AdditionalDeclaration1Component],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, JwtHelperService, InvestmentAccountService,
        { provide: InvestmentAccountService, useClass: MockInvestmentAccountService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclaration1Component);
    router = TestBed.get(Router);
    investAccountService = TestBed.get(InvestmentAccountService);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create AdditionalDeclaration1Component', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title', () => {
    const setPageTitleSpy = spyOn(navbarService, 'setPageTitle');
    component.setPageTitle('ADDITIONAL_DECLARATION.TITLE');
    expect(setPageTitleSpy).toHaveBeenCalledWith('ADDITIONAL_DECLARATION.TITLE');
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    spyOn(investAccountService, 'isSingaporeResident').and.returnValue(true);
    const getOccupationListSpy = spyOn(component, 'getOccupationList');
    spyOn(investAccountService, 'getCountriesFormDataByFilter').and.returnValue([]);
    spyOn(investAccountService, 'getInvestmentAccountFormData').and.returnValue({});
    // spyOn(component, 'buildForm').and.returnValue(new FormGroup({pepCountry:  new FormControl('')}));
    const observeCountryChangeSpy = spyOn(component, 'observeCountryChange');
    const observeOccupationChangeSpy = spyOn(component, 'observeOccupationChange');
    const loadDDCRoadmapSpy = spyOn(investAccountService, 'loadDDCRoadmap');
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(true);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    expect(component.isUserNationalitySingapore).toEqual(true);
    expect(getOccupationListSpy).toHaveBeenCalled();
    expect(component.addInfoFormValues).toEqual({});
    // expect(component.addInfoForm).toEqual({pepCountry: ''});
    expect(component.countries).toEqual([]);
    expect(observeCountryChangeSpy).toHaveBeenCalled();
    expect(observeOccupationChangeSpy).toHaveBeenCalled();
    expect(loadDDCRoadmapSpy).toHaveBeenCalled();
  });

  it('should buildForm', () => {
    spyOn(component, 'buildForm').and.returnValue({});
    component.buildForm();
    // expect(loadDDCRoadmapSpy).toHaveBeenCalled();
  });
});
