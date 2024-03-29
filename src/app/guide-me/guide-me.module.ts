import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NouisliderModule } from 'ng2-nouislider';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { ProductDetailComponent } from '../shared/components/product-detail/product-detail.component';
import { CustomCurrencyPipe } from '../shared/Pipes/custom-currency.pipe';
import { SharedModule } from '../shared/shared.module';
import { LoggedUserService } from '../sign-up/auth-guard.service';
import { NavbarService } from './../shared/navbar/navbar.service';
import { CiAssessmentComponent } from './ci-assessment/ci-assessment.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedFormComponent } from './get-started/get-started-form/get-started-form.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { GuideMeAccessGuard, MyinfoAssetsAccessGuard } from './guide-me-access-guard';
import { GuideMeRoutingModule } from './guide-me-routing.module';
import { HospitalPlanComponent } from './hospital-plan/hospital-plan.component';
import { IncomeComponent } from './income/income.component';
import { InsuranceResultComponent } from './insurance-results/insurance-result/insurance-result.component';
import { InsuranceResultsComponent } from './insurance-results/insurance-results.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { LifeProtectionFormComponent } from './life-protection/life-protection-form/life-protection-form.component';
import { LifeProtectionComponent } from './life-protection/life-protection.component';
import { LtcAssessmentComponent } from './ltc-assessment/ltc-assessment.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { OcpDisabilityComponent } from './ocp-disability/ocp-disability.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { InsuranceMyinfoRetrievalComponent } from './insurance-myinfo-retrieval/insurance-myinfo-retrieval.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/guide-me/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule, GuideMeRoutingModule, ReactiveFormsModule, NgbModule,
    NouisliderModule,
    SharedModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SlickCarouselModule
  ],
  declarations: [
    ProfileComponent,
    GetStartedComponent,
    GetStartedFormComponent,
    ProtectionNeedsComponent,
    IncomeComponent,
    ExpensesComponent,
    MyAssetsComponent,
    LiabilitiesComponent,
    FinAssessmentComponent,
    InsureAssessmentComponent,
    LifeProtectionComponent,
    LifeProtectionFormComponent,
    LtcAssessmentComponent,
    CiAssessmentComponent,
    OcpDisabilityComponent,
    HospitalPlanComponent,
    InsuranceResultsComponent,
    InsuranceResultComponent,
    RecommendationsComponent,
    CustomCurrencyPipe,
    InsuranceMyinfoRetrievalComponent
  ],
  providers: [CurrencyPipe, CustomCurrencyPipe, LoggedUserService, GuideMeAccessGuard, MyinfoAssetsAccessGuard],
  entryComponents: [ProductDetailComponent]
})
export class GuideMeModule {

  constructor(public navbarService: NavbarService) {
  }
}
