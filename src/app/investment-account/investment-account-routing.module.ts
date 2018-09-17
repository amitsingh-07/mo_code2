import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { INVESTMENT_ACCOUNT_ROUTES } from './investment-account-routes.constants';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';

const routes: Routes = [
  { path: INVESTMENT_ACCOUNT_ROUTES.ROOT, redirectTo: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_INFO, pathMatch: 'full' },
  { path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_INFO, component: PersonalInfoComponent },
  { path: INVESTMENT_ACCOUNT_ROUTES.RESIDENTIAL_ADDRESS, component: ResidentialAddressComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentAccountRoutingModule { }
