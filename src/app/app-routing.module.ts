import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'direct', pathMatch: 'full'},
  {path: 'direct', loadChildren: './direct/direct.module#DirectModule'},
  {path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule'},
  {path: 'portfolio', loadChildren: './portfolio/portfolio.module#PortfolioModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  declarations: []
})
export class AppRoutingModule { }
