import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:"guideme",loadChildren:"./guide-me/guide-me.module#GuideMeModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: []
})
export class AppRoutingModule { }
