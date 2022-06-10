import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CORPBIZ_ROUTES } from './corpbiz-welcome-flow.routes.constants'
import { GetStartedComponent } from './get-started/get-started.component';
import { TellAboutYouComponent } from './tell-about-you/tell-about-you.component';
import { CpfLifePayoutComponent } from './cpf-life-payout/cpf-life-payout.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { AuthGuardService as AuthGuard  } from '../sign-up/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: CORPBIZ_ROUTES.TELL_ABOUT_YOU, component: TellAboutYouComponent },
      { path: CORPBIZ_ROUTES.LIFE_PAYOUT , component: CpfLifePayoutComponent },
      { path: CORPBIZ_ROUTES.DOWNLOAD_REPORT, component: DownloadReportComponent },
      { path: CORPBIZ_ROUTES.GET_STARTED, component: GetStartedComponent },
      { path: CORPBIZ_ROUTES.ROOT, redirectTo: CORPBIZ_ROUTES.GET_STARTED, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorpBizWelcomeflowRoutingModule { }
