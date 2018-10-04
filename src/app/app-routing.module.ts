import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';

import { CallBackComponent } from './call-back/call-back.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'myinfo', component: CallBackComponent},
  {path: 'home', component: HomeComponent },
  {path: 'direct', loadChildren: './direct/direct.module#DirectModule'},
  {path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule'},
  {path: 'articles', loadChildren: './article/article.module#ArticleModule'},
  {path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule'},
  {path: 'account', loadChildren: './sign-up/sign-up.module#SignUpModule'},
  {path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsModule'},
  {path: 'investment-account', loadChildren: './investment-account/investment-account.module#InvestmentAccountModule'},
  // Legacy Routes
  {path: 'learn', loadChildren: './article/article.module#ArticleModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  declarations: []
})
export class AppRoutingModule { }

// MyInfo changes
export function validateUrl(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
  if (window.location.pathname.indexOf('myinfo') > -1) {
    if (!url[0]) {
      url.push(new UrlSegment(window.location.pathname.split('/')[1], {data: window.location.search}));
    } else {
      url[0].path = window.location.pathname;
      url[0].path = url[0].path.split('/')[1];
      url[0].parameters = {data: window.location.search};
    }
    return ({consumed: url});
  }
}
