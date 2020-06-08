import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { APP_ROUTES } from './app-routes.constants';
import { CallBackComponent } from './call-back/call-back.component';
import { PendingChangesGuard } from './changes.guard';
import { ComprehensiveChildEnableGuard } from './comprehensive/comprehensive-child-enable-guard';
import { ComprehensiveEnableGuard } from './comprehensive/comprehensive-enable-guard';
import {
  EmailEnquirySuccessComponent
} from './email-enquiry-success/email-enquiry-success.component';
import { ExternalRouteGuard } from './external-route-guard';
import { FAQComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { InvestmentMaintenanceGuard } from './investment-maintenance/investment-maintenance-guard';
import { InvestmentMaintenanceComponent } from './investment-maintenance/investment-maintenance.component';
import { InvestmentChildEnableGuard } from './investment/investment-engagement-journey/investment-child-enable-guard';
import { InvestmentEnableGuard } from './investment/investment-engagement-journey/investment-enable-guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { TestMyInfoComponent } from './test-my-info/test-my-info.component';
import { UrlRedirectComponent } from './url-redirect.component';
import { WillWritingChildEnableGuard } from './will-writing/will-writing-child-enable-guard';
import { WillWritingEnableGuard } from './will-writing/will-writing-enable-guard';

import { PaymentChildEnableGuard } from './payment/payment-child-enable-guard';
import { PaymentEnableGuard } from './payment/payment-enable-guard';

const routes: Routes = [
  {
    path: '', canDeactivate: [PendingChangesGuard],
    children: [
      { component: UrlRedirectComponent, matcher: validateUrl },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: '9462test-myinfo', component: TestMyInfoComponent },
      { path: 'direct', loadChildren: './direct/direct.module#DirectModule' },
      { path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule' },
      { path: 'accounts', loadChildren: './sign-up/sign-up.module#SignUpModule' },
      { path: 'myinfo', component: CallBackComponent },
      { path: 'faq', component: FAQComponent },
      { path: 'investment-maintenance', component: InvestmentMaintenanceComponent, canActivate: [InvestmentMaintenanceGuard]},
      {
        path: APP_ROUTES.COMPREHENSIVE, loadChildren: './comprehensive/comprehensive.module#ComprehensiveModule',
        canActivate: [ComprehensiveEnableGuard],
        canActivateChild: [ComprehensiveChildEnableGuard]
      },
      {
        path: 'investment/engagement',
        loadChildren: './investment/investment-engagement-journey/investment-engagement-journey.module#InvestmentEngagementJourneyModule',
        canActivate: [InvestmentEnableGuard],
        canActivateChild: [InvestmentChildEnableGuard]
      },
      {
        path: 'investment/account',
        loadChildren: './investment/investment-account/investment-account.module#InvestmentAccountModule',
        canActivate: [InvestmentEnableGuard],
        canActivateChild: [InvestmentChildEnableGuard]
      },
      {
        path: 'investment/manage',
        loadChildren: './investment/manage-investments/manage-investments.module#ManageInvestmentsModule',
        canActivate: [InvestmentEnableGuard],
        canActivateChild: [InvestmentChildEnableGuard]
      },
      {
        path: 'investment',
        loadChildren: './investment/investment-common/investment-common.module#InvestmentCommonModule',
        canActivate: [InvestmentEnableGuard],
        canActivateChild: [InvestmentChildEnableGuard]
      },
      {
        path: 'will-writing',
        loadChildren: './will-writing/will-writing.module#WillWritingModule',
        canActivate: [WillWritingEnableGuard],
        canActivateChild: [WillWritingChildEnableGuard]
      },
      {
        path: 'retirement-planning',
        loadChildren: './retirement-planning/retirement-planning.module#RetirementPlanningModule',
        canActivate: [],
        canActivateChild: []
      },
      {
        path: 'payment',
        loadChildren: './payment/payment.module#PaymentModule',
        canActivate: [PaymentEnableGuard],
        canActivateChild: [PaymentChildEnableGuard]
      },
      // Legacy Routes
      { path: 'email-enquiry/success', component: EmailEnquirySuccessComponent },
      { path: 'page-not-found', component: NotFoundComponent },
      { path: '**', component: NotFoundComponent, canActivate: [ExternalRouteGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  declarations: []
})
export class AppRoutingModule { }

// MyInfo changes
export function validateUrl(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  if (window.location.search === '?errorcode=eSingPass_00_00_01') {
    if (window.opener && window.opener.myinfo) {
      const token: string = window.opener.failed('CANCELLED');
      if (token === 'MY_INFO') {

      }
      // attempt to authenticate with the token...
    } else {
      return ({ consumed: url });
    }
  }
}
