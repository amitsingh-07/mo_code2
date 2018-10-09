import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutMeComponent } from './about-me/about-me.component';
import { CheckEligibilityComponent } from './check-eligibility/check-eligibility.component';
import { DistributeYourEstateComponent } from './distribute-your-estate/distribute-your-estate.component';
import { FaqComponent } from './faq/faq.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { MyChildGuardianComponent } from './my-child-guardian/my-child-guardian.component';
import { MyFamilyComponent } from './my-family/my-family.component';
import { TellUsAboutYourselfComponent } from './tell-us-about-yourself/tell-us-about-yourself.component';
import { WILL_WRITING_ROUTES } from './will-writing-routes.constants';

const routes: Routes = [
  { path: WILL_WRITING_ROUTES.ROOT, component: IntroductionComponent },
  { path: WILL_WRITING_ROUTES.INTRODUCTION, component: IntroductionComponent },
  { path: WILL_WRITING_ROUTES.FAQ, component: FaqComponent },
  { path: WILL_WRITING_ROUTES.CHECK_ELIGIBILITY, component: CheckEligibilityComponent },
  { path: WILL_WRITING_ROUTES.HOW_IT_WORKS, component: HowItWorksComponent },
  { path: WILL_WRITING_ROUTES.HOW_IT_WORKS, component: TellUsAboutYourselfComponent },
  { path: WILL_WRITING_ROUTES.HOW_IT_WORKS, component: AboutMeComponent },
  { path: WILL_WRITING_ROUTES.HOW_IT_WORKS, component: MyFamilyComponent },
  { path: WILL_WRITING_ROUTES.HOW_IT_WORKS, component: MyChildGuardianComponent },
  { path: WILL_WRITING_ROUTES.HOW_IT_WORKS, component: DistributeYourEstateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class WillWritingRoutingModule {}
