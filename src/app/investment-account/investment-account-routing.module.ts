import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../sign-up/auth-guard.service';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { FinanicalDetailsComponent } from './finanical-details/finanical-details.component';
import { INVESTMENT_ACCOUNT_ROUTES } from './investment-account-routes.constants';
import {
    PersonalDeclarationComponent
} from './personal-declaration/personal-declaration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { SelectNationalityComponent } from './select-nationality/select-nationality.component';

import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

const routes: Routes = [
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ROOT,
    redirectTo: INVESTMENT_ACCOUNT_ROUTES.SELECT_NATIONALITY,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.SELECT_NATIONALITY,
    component: SelectNationalityComponent,
     canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_INFO,
    component: PersonalInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.RESIDENTIAL_ADDRESS,
    component: ResidentialAddressComponent,
     canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.EMPLOYMENT_DETAILS,
    component: EmploymentDetailsComponent,
     canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.FINANICAL_DETAILS,
    component: FinanicalDetailsComponent ,
    canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.TAX_INFO,
    component: TaxInfoComponent,
     canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS,
    component: UploadDocumentsComponent,
    canActivate: [AuthGuard]
  },
  { path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_DECLARATION,
    component: PersonalDeclarationComponent,
     canActivate: [AuthGuard]
  },
  { path: INVESTMENT_ACCOUNT_ROUTES.ACKNOWLEDGEMENT,
    component: AcknowledgementComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentAccountRoutingModule { }
