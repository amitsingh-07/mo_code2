import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'guideme', loadChildren: './guide-me/guide-me.module#GuideMeModule'},
  {path: 'signup', loadChildren: './sign-up/sign-up.module#SignUpModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: []
})
export class AppRoutingModule { }
