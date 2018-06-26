import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path:'details',component:InsuranceDetailsComponent},
  {path:'register',component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routeComponents=[InsuranceDetailsComponent,RegisterComponent];