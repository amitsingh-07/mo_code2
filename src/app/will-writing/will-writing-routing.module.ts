import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutMeComponent } from './about-me/about-me.component';
import { AppointYourExecutorTrusteeComponent } from './appoint-your-executor-trustee/appoint-your-executor-trustee.component';
import { CheckEligibilityComponent } from './check-eligibility/check-eligibility.component';
import { DistributeYourEstateComponent } from './distribute-your-estate/distribute-your-estate.component';
import { FaqComponent } from './faq/faq.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { MyBeneficiariesComponent } from './my-beneficiaries/my-beneficiaries.component';
import { MyChildGuardianComponent } from './my-child-guardian/my-child-guardian.component';
import { MyEstateDistributionComponent } from './my-estate-distribution/my-estate-distribution.component';
import { MyExecutorTrusteeComponent } from './my-executor-trustee/my-executor-trustee.component';
import { MyFamilyComponent } from './my-family/my-family.component';
import { ReviewYourDetailsComponent } from './review-your-details/review-your-details.component';
import { TellUsAboutYourselfComponent } from './tell-us-about-yourself/tell-us-about-yourself.component';
import { WILL_WRITING_ROUTES } from './will-writing-routes.constants';

const routes: Routes = [
  { path: WILL_WRITING_ROUTES.ROOT, component: IntroductionComponent },
  { path: WILL_WRITING_ROUTES.INTRODUCTION, component: IntroductionComponent },
  { path: WILL_WRITING_ROUTES.FAQ, component: FaqComponent },
  { path: WILL_WRITING_ROUTES.CHECK_ELIGIBILITY, component: CheckEligibilityComponent },
  { path: WILL_WRITING_ROUTES.HOW_IT_WORKS, component: HowItWorksComponent },
  { path: WILL_WRITING_ROUTES.TELL_US_ABOUT_YOURSELF, component: TellUsAboutYourselfComponent },
  { path: WILL_WRITING_ROUTES.ABOUT_ME, component: AboutMeComponent },
  { path: WILL_WRITING_ROUTES.MY_FAMILY, component: MyFamilyComponent },
  { path: WILL_WRITING_ROUTES.MY_CHILD_GUARDIAN, component: MyChildGuardianComponent },
  { path: WILL_WRITING_ROUTES.DISTRIBUTE_YOUR_ESTATE, component: DistributeYourEstateComponent },
  { path: WILL_WRITING_ROUTES.APPOINT_EXECUTOR_TRUSTEE, component: AppointYourExecutorTrusteeComponent},
  { path: WILL_WRITING_ROUTES.MY_BENEFICIARIES, component: MyBeneficiariesComponent},
  { path: WILL_WRITING_ROUTES.REVIEW_YOUR_DETAILS, component: ReviewYourDetailsComponent},
  { path: WILL_WRITING_ROUTES.MY_EXECUTOR_TRUSTEE, component: MyExecutorTrusteeComponent},
  { path: WILL_WRITING_ROUTES.MY_ESTATE_DISTRIBUTION, component: MyEstateDistributionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class WillWritingRoutingModule {}
