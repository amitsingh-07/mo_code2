import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'guideme', pathMatch: 'full'},
  {path: 'direct', loadChildren: './direct/direct.module#DirectModule'},
  {path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule'},
  {path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule'},
  // {component: CallBackComponent, matcher: test},
  {path: 'account', loadChildren: './sign-up/sign-up.module#SignUpModule'},
  {path: 'investment-account', loadChildren: './investment-account/investment-account.module#InvestmentAccountModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  declarations: []
})
export class AppRoutingModule { }

// MyInfo changes
// export function test(url: UrlSegment[], group: UrlSegmentGroup, route: Route) {
//   if (window.location.pathname.indexOf('callback') > -1) {
//     if (!url[0]) {
//       url.push(new UrlSegment(window.location.pathname.split('/')[1], {data: window.location.search}));
//     } else {
//       url[0].path = window.location.pathname;
//       url[0].path = url[0].path.split('/')[1];
//       url[0].parameters = {data: window.location.search};
//     }
//   }
//   return ({consumed: url});
// }
