import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule'},
  {path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule'},
  {path: 'signup', loadChildren: './sign-up/sign-up.module#SignUpModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  declarations: []
})
export class AppRoutingModule { }
