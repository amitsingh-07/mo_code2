import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'guideme'},
  {path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule'},
  {path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule'},
  {path: 'signup', loadChildren: './sign-up/sign-up.module#SignUpModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: []
})
export class AppRoutingModule { }
