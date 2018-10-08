import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { CallBackComponent } from './call-back/call-back.component';
import { PendingChangesGuard } from './changes.guard';
import { HomeComponent } from './home/home.component';
import { UrlRedirectComponent } from './url-redirect.component';

const routes: Routes = [
  {
    path: '', canDeactivate: [PendingChangesGuard], children: [
      { component: UrlRedirectComponent, matcher: validateUrl },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'direct', loadChildren: './direct/direct.module#DirectModule' },
      { path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule' },
      { path: 'articles', loadChildren: './article/article.module#ArticleModule' },
      { path: 'account', loadChildren: './sign-up/sign-up.module#SignUpModule' },
      { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsModule' },
      /*
      { path: 'myinfo', component: CallBackComponent },
      { path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule' },
      { path: 'investment-account', loadChildren: './investment-account/investment-account.module#InvestmentAccountModule' },
      */
      // Legacy Routes
      { path: 'learn', loadChildren: './article/article.module#ArticleModule' }

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
