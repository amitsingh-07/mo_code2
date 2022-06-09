import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetStartedComponent } from './get-start/get-start.component';
import { TellAboutYouComponent } from './tell-about-you/tell-about-you.component';
import { CpfLifePayoutComponent } from './cpf-life-payout/cpf-life-payout.component';
import { DownloadReportComponent } from './download-report/download-report.component';

const routes: Routes = [
  { path: 'welcome-tell-about-you', component: TellAboutYouComponent },
  { path: 'life-payout', component: CpfLifePayoutComponent },
  { path: 'download-report', component: DownloadReportComponent },
  { path: 'welcome-page', component: GetStartedComponent },
  { path: '', redirectTo: 'welcome-page', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorpBizWelcomeflowRoutingModule { }
