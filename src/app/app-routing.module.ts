import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { CallBackComponent } from './call-back/call-back.component';
import { PendingChangesGuard } from './changes.guard';
import { HomeComponent } from './home/home.component';

import { DisclosuresComponent } from './shared/components/disclosures/disclosures.component';
import { FairDealingComponent } from './shared/components/fair-dealing/fair-dealing.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './shared/components/terms-of-use/terms-of-use.component';

import { TestMyInfoComponent } from './test-my-info/test-my-info.component';
import { UrlRedirectComponent } from './url-redirect.component';

const routes: Routes = [
  {
    path: '', canDeactivate: [PendingChangesGuard], children: [
      { component: UrlRedirectComponent, matcher: validateUrl },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: '4456test-myinfo', component: TestMyInfoComponent},
      { path: 'direct', loadChildren: './direct/direct.module#DirectModule' },
      { path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule' },
      { path: 'account', loadChildren: './sign-up/sign-up.module#SignUpModule' },
      { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsModule' },
      { path: 'myinfo', component: CallBackComponent },

      { path: 'articles', loadChildren: './article/article.module#ArticleModule' },
      { path: 'learn', loadChildren: './article/article.module#ArticleModule' },

      { path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule' },
      { path: 'investment-account', loadChildren: './investment-account/investment-account.module#InvestmentAccountModule' },
      { path: 'topup-and-withdraw', loadChildren: './topup-and-withdraw/topup-and-withdraw.module#TopupAndWithdrawModule' },

      { path: 'will-writing', loadChildren: './will-writing/will-writing.module#WillWritingModule' },

      // Legacy Routes
      { path: 'terms-of-use', component: TermsOfUseComponent},
      { path: 'privacy-policy', component: PrivacyPolicyComponent},
      { path: 'disclosures', component: DisclosuresComponent},
      { path: 'fair-dealing', component: FairDealingComponent}
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
    return ({ consumed: url });
  }
}
