import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeStaticPageComponent } from './welcome-static-page/welcome-static-page.component';
import { WelcomeStepOneComponent } from './welcome-step-one/welcome-step-one.component';
// import { WelcomeJourney2Component } from './welcome-journey2/welcome-journey2.component';

const routes: Routes = [
  // { path: 'welcome-journey', component: WelcomeJourneyComponent },
  // { path: 'welcome-journey1', component: WelcomeJourney1Component },
  { path: 'welcome-step1', component: WelcomeStepOneComponent },
  { path: '', component: WelcomeStaticPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeflowRoutingModule { }
