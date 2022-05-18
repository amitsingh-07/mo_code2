import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComparePlansComponent } from './compare-plans/compare-plans.component';
import { DirectAccessGuard } from './direct-access-guard';
import { DirectCanDeactivateGuard } from './direct-can-deactivate-guard';
import { DIRECT_ROUTES } from './direct-routes.constants';
import { DirectComponent } from './direct.component';

const routes: Routes = [
  {
    path: '',
    // canDeactivate: [DirectCanDeactivateGuard],
    children: [
      { path: '', component: DirectComponent, canActivate: [DirectAccessGuard] },
      {
        path: DIRECT_ROUTES.COMPARE_PLANS,
        component: ComparePlansComponent,
        canActivate: [DirectAccessGuard]
      },
      { path: '**', redirectTo: '/page-not-found' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DirectCanDeactivateGuard]
})
export class DirectRoutingModule { }
