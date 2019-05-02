import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { SharedModule } from './../shared/shared.module';
import { AboutMeComponent } from './about-me/about-me.component';
import {
  AppointYourExecutorTrusteeComponent
} from './appoint-your-executor-trustee/appoint-your-executor-trustee.component';
import { CheckEligibilityComponent } from './check-eligibility/check-eligibility.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { DistributeYourEstateComponent } from './distribute-your-estate/distribute-your-estate.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { MyBeneficiariesComponent } from './my-beneficiaries/my-beneficiaries.component';
import { MyChildGuardianComponent } from './my-child-guardian/my-child-guardian.component';
import { MyEstateDistributionComponent } from './my-estate-distribution/my-estate-distribution.component';
import { MyExecutorTrusteeComponent } from './my-executor-trustee/my-executor-trustee.component';
import { MyFamilyComponent } from './my-family/my-family.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { ReviewYourDetailsComponent } from './review-your-details/review-your-details.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TellUsAboutYourselfComponent } from './tell-us-about-yourself/tell-us-about-yourself.component';
import { ValidateYourWillComponent } from './validate-your-will/validate-your-will.component';
import { WillWritingAccessGuard } from './will-writing-access-guard';
import { WillWritingRoutingModule } from './will-writing-routing.module';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/will-writing/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    WillWritingRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AboutMeComponent,
    CheckEligibilityComponent,
    DistributeYourEstateComponent,
    HowItWorksComponent,
    IntroductionComponent,
    MyChildGuardianComponent,
    MyFamilyComponent,
    PageTitleComponent,
    TellUsAboutYourselfComponent,
    AppointYourExecutorTrusteeComponent,
    MyBeneficiariesComponent,
    ReviewYourDetailsComponent,
    MyExecutorTrusteeComponent,
    MyEstateDistributionComponent,
    ConfirmationComponent,
    ValidateYourWillComponent,
    SignUpComponent
  ],
  providers: [WillWritingAccessGuard]
})
export class WillWritingModule { }
