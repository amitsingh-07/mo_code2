import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { ArticleChildEnableGuard } from './article/article-child-enable-guard';
import { ArticleEnableGuard } from './article/article-enable-guard';
import { CallBackComponent } from './call-back/call-back.component';
import { PendingChangesGuard } from './changes.guard';
import {
    EmailEnquirySuccessComponent
} from './email-enquiry-success/email-enquiry-success.component';
import { InvestmentChildEnableGuard } from './investment/investment-engagement-journey/investment-child-enable-guard';
import { InvestmentEnableGuard } from './investment/investment-engagement-journey/investment-enable-guard';
import { FAQComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PromotionChildEnableGuard } from './promotion/promotion-child-enable-guard';
import { PromotionEnableGuard } from './promotion/promotion-enable-guard';
import { DisclosuresComponent } from './shared/components/disclosures/disclosures.component';
import { FairDealingComponent } from './shared/components/fair-dealing/fair-dealing.component';
import {
    PrivacyPolicyComponent
} from './shared/components/privacy-policy/privacy-policy.component';
import {
    SecurityPolicyComponent
} from './shared/components/security-policy/security-policy.component';
import { TermsOfUseComponent } from './shared/components/terms-of-use/terms-of-use.component';
import { TestMyInfoComponent } from './test-my-info/test-my-info.component';
import { UrlRedirectComponent } from './url-redirect.component';
import { WillWritingChildEnableGuard } from './will-writing/will-writing-child-enable-guard';
import { WillWritingEnableGuard } from './will-writing/will-writing-enable-guard';

const routes: Routes = [
  {
    path: '', canDeactivate: [PendingChangesGuard], children: [
      { component: UrlRedirectComponent, matcher: validateUrl },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: '9462test-myinfo', component: TestMyInfoComponent },
      { path: 'direct', loadChildren: './direct/direct.module#DirectModule' },
      { path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule' },
      { path: 'account', loadChildren: './sign-up/sign-up.module#SignUpModule' },
      { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsModule' },
      { path: 'myinfo', component: CallBackComponent },
      { path: 'faq', component: FAQComponent },

      { path: 'articles',
        loadChildren: './article/article.module#ArticleModule',
        canActivate: [ArticleEnableGuard],
        canActivateChild: [ArticleChildEnableGuard]
      },
      { path: 'learn',
        loadChildren: './article/article.module#ArticleModule',
        canActivate: [ArticleEnableGuard],
        canActivateChild: [ArticleEnableGuard]
      },
      { path: 'investment/engagement',
        loadChildren: './investment/investment-engagement-journey/investment-engagement-journey.module#InvestmentEngagementJourneyModule',
        canActivate: [InvestmentEnableGuard],
        canActivateChild: [InvestmentChildEnableGuard]
      },
      { path: 'investment/account',
        loadChildren: './investment/investment-account/investment-account.module#InvestmentAccountModule',
        canActivate: [InvestmentEnableGuard],
        canActivateChild: [InvestmentChildEnableGuard]
      },
      { path: 'investment/manage',
        loadChildren: './investment/manage-investments/manage-investments.module#ManageInvestmentsModule',
        canActivate: [InvestmentEnableGuard],
        canActivateChild: [InvestmentChildEnableGuard]
      },
      { path: 'investment',
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
      { path: 'promotions', loadChildren: './promotion/promotion.module#PromotionModule',
        canActivate: [PromotionEnableGuard],
        canActivateChild: [PromotionChildEnableGuard]
      },
      // Legacy Routes
      { path: 'terms-of-use', component: TermsOfUseComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'disclosures', component: DisclosuresComponent },
      { path: 'fair-dealing', component: FairDealingComponent },
      { path: 'security-policy', component: SecurityPolicyComponent },
      { path: 'email-enquiry/success', component: EmailEnquirySuccessComponent },
      { path: '**', component: NotFoundComponent }
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
