import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedUserService } from '../sign-up/auth-guard.service';
import { ComprehensiveStepsComponent } from './comprehensive-steps/comprehensive-steps.component';
import {ComprehensiveComponent} from './comprehensive/comprehensive.component';
import { ShouldersComponent } from './shoulders/shoulders.component';

const routes: Routes = [
  {
    path: '', canActivate: [LoggedUserService], children: [
      { path: '', component: ComprehensiveComponent },
      { path: 'steps', component: ComprehensiveStepsComponent },
      { path: 'shoulders', component: ShouldersComponent }
 ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprehensiveRoutingModule { }
