import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterService } from './../../../shared/footer/footer.service';
import { NavbarService } from './../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from './../investment-account-service';
import { AdditionalDeclarationInfoComponent } from './additional-declaration-info.component';

describe('AdditionalDeclarationInfoComponent', () => {
  let component: AdditionalDeclarationInfoComponent;
  let fixture: ComponentFixture<AdditionalDeclarationInfoComponent>;
  let router: Router;
  let navbarService: NavbarService;
  let footerService: FooterService;
  let investAccountService: InvestmentAccountService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule.forRoot(), HttpClientTestingModule, HttpModule,
      JwtModule.forRoot({config: {}})],
      declarations: [ AdditionalDeclarationInfoComponent ],
      providers: [ JwtHelperService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDeclarationInfoComponent);
    router = TestBed.get(Router);
    navbarService = TestBed.get(NavbarService);
    footerService = TestBed.get(FooterService);
    investAccountService = TestBed.get(InvestmentAccountService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create AdditionalDeclarationInfoComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should execute ngOnInit', () => {
    const setNavbarModeSpy = spyOn(navbarService, 'setNavbarMode');
    const setNavbarMobileVisibilitySpy = spyOn(navbarService, 'setNavbarMobileVisibility');
    const setFooterVisibilitySpy = spyOn(footerService, 'setFooterVisibility');
    spyOn(investAccountService, 'getInvestmentAccountFormData').and.returnValue({pep: ''});
    component.ngOnInit();
    expect(setNavbarModeSpy).toHaveBeenCalledWith(6);
    expect(setNavbarMobileVisibilitySpy).toHaveBeenCalledWith(false);
    expect(setFooterVisibilitySpy).toHaveBeenCalledWith(false);
    expect(component.addInfoFormValues).toEqual({pep: ''});
  });

  it('should navigate to additional declaration step 1 if pep detail exist, else step 2', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.addInfoFormValues = {pep: '123'};
    component.goNext();
    expect(navigateSpy).toHaveBeenCalledWith(['../investment/account/additional-declaration/1']);
    component.addInfoFormValues = {pep: ''};
    component.goNext();
    expect(navigateSpy).toHaveBeenCalledWith(['../investment/account/additional-declaration/2']);
  });
});
