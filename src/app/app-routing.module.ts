import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/guideme', pathMatch: 'full'},
  {path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: []
})
export class AppRoutingModule { }
