import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeflowComponent } from './welcome-flow-start/welcome-flow.component';
import { WelcomeflowTellAboutYouComponent } from './welcome-flow-tell-about-you/welcome-flow-tell-about-you.component';
import { WelcomeflowCpfLifePayoutComponent } from './welcome-flow-cpf-life-payout/welcome-flow-cpf-life-payout.component';
import { DownloadReportComponent } from './download-report/download-report.component';

const routes: Routes = [
  { path: 'welcome-tell-about-you', component: WelcomeflowTellAboutYouComponent },
  { path: 'life-payout', component: WelcomeflowCpfLifePayoutComponent },
  { path: 'download-report', component: DownloadReportComponent },
  { path: 'welcome-page', component: WelcomeflowComponent },
  { path: '', redirectTo: 'welcome-page', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorpBizWelcomeflowRoutingModule { }
