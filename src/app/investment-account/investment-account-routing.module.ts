import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../sign-up/auth-guard.service';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import {
    AdditionalDeclarationInfoComponent
} from './additional-declaration-info/additional-declaration-info.component';
import {
    AdditionalDeclarationStep1Component
} from './additional-declaration-step1/additional-declaration-step1.component';
import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { FinanicalDetailsComponent } from './finanical-details/finanical-details.component';
import { INVESTMENT_ACCOUNT_ROUTES } from './investment-account-routes.constants';
import {
    PersonalDeclarationComponent
} from './personal-declaration/personal-declaration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { SelectNationalityComponent } from './select-nationality/select-nationality.component';

import { AccountSetupCompletedComponent } from './account-setup-completed/account-setup-completed.component';
import { AdditionalDeclarationSubmitComponent } from './additional-declaration-submit/additional-declaration-submit.component';
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
    component: FinanicalDetailsComponent,
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
  {
    path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_DECLARATION,
    component: PersonalDeclarationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.CONFIRM_PORTFOLIO,
    component: ConfirmPortfolioComponent,
    canActivate: [AuthGuard]
  },
  { path: INVESTMENT_ACCOUNT_ROUTES.ACKNOWLEDGEMENT,
    component: AcknowledgementComponent,
  },
  { path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION,
    component: AdditionalDeclarationInfoComponent,
  },
  { path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION_STEP1,
    component: AdditionalDeclarationStep1Component,
  },
  { path: INVESTMENT_ACCOUNT_ROUTES.SETUP_COMPLETED,
    component: AccountSetupCompletedComponent,
  },
  { path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION_SUBMIT,
    component: AdditionalDeclarationSubmitComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentAccountRoutingModule { }
