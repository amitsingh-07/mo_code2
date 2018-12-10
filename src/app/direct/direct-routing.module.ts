import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedUserService } from '../sign-up/auth-guard.service';
import { ComparePlansComponent } from './compare-plans/compare-plans.component';
import { DirectAccessGuard } from './direct-access-guard';
import { DIRECT_ROUTES } from './direct-routes.constants';
import { DirectComponent } from './direct.component';

const routes: Routes = [
  {
    path: '', canActivate: [LoggedUserService], children: [
      { path: '', component: DirectComponent },
      {
        path: DIRECT_ROUTES.COMPARE_PLANS,
        component: ComparePlansComponent,
        canActivate: [DirectAccessGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectRoutingModule { }
