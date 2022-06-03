import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeStaticPageComponent } from './welcome-static-page/welcome-static-page.component';
import { WelcomeStepOneComponent } from './welcome-step-one/welcome-step-one.component';
import { WelcomeStepTwoComponent } from './welcome-step-two/welcome-step-two.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { StartPlanningComponent } from './start-planning/start-planning.component';

const routes: Routes = [
  // { path: 'welcome-journey', component: WelcomeJourneyComponent },
  // { path: 'welcome-journey1', component: WelcomeJourney1Component },
  { path: 'welcome-step1', component: WelcomeStepOneComponent },
  { path: 'welcome-step2', component: WelcomeStepTwoComponent },
  { path: 'download-report', component: DownloadReportComponent },
  { path: 'start-planning', component: StartPlanningComponent },
  { path: '', component: WelcomeStaticPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeflowRoutingModule { }
