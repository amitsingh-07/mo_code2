import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { INVESTMENT_ACCOUNT_ROUTES } from './investment-account-routes.constants';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { SelectNationalityComponent } from './select-nationality/select-nationality.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';

const routes: Routes = [
  { path: INVESTMENT_ACCOUNT_ROUTES.ROOT, redirectTo: INVESTMENT_ACCOUNT_ROUTES.SELECT_NATIONALITY, pathMatch: 'full' },
  { path: INVESTMENT_ACCOUNT_ROUTES.SELECT_NATIONALITY, component: SelectNationalityComponent },
  { path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_INFO, component: PersonalInfoComponent },
  { path: INVESTMENT_ACCOUNT_ROUTES.RESIDENTIAL_ADDRESS, component: ResidentialAddressComponent },
  { path: INVESTMENT_ACCOUNT_ROUTES.EMPLOYMENT_DETAILS, component: EmploymentDetailsComponent },
  { path: INVESTMENT_ACCOUNT_ROUTES.TAX_INFO, component: TaxInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentAccountRoutingModule { }
