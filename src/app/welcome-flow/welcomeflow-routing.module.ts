import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeflowComponent } from './welcomeflow/welcomeflow.component';
import { WelcomeflowTellAboutYouComponent } from './welcomeflow-tell-about-you/welcomeflow-tell-about-you.component';
import { WelcomeflowCpfLifePayoutComponent } from './welcomeflow-cpf-life-payout/welcomeflow-cpf-life-payout.component';
import { DownloadReportComponent } from './download-report/download-report.component';

const routes: Routes = [
  { path: 'welcome-tell-about-you', component: WelcomeflowTellAboutYouComponent },
  { path: 'life-payout', component: WelcomeflowCpfLifePayoutComponent },
  { path: 'download-report', component: DownloadReportComponent },
  { path: '', component: WelcomeflowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeflowRoutingModule { }
