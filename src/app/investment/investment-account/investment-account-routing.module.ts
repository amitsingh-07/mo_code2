import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../../sign-up/auth-guard.service';
import {
    InvestmentAccountGuardService as InvestmentAccountGuard
} from './investment-account-guard.service';
import { INVESTMENT_ACCOUNT_ROUTES } from './investment-account-routes.constants';
import { AccountStatusComponent } from './account-status/account-status.component';
import {
    AdditionalDeclarationInfoComponent
} from './additional-declaration-info/additional-declaration-info.component';
import {
    AdditionalDeclaration1Component
} from './additional-declaration1/additional-declaration1.component';
import {
    AdditionalDeclaration2Component
} from './additional-declaration2/additional-declaration2.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { FinancialDetailsComponent } from './financial-details/financial-details.component';
import { NationalityComponent } from './nationality/nationality.component';
import {
    PersonalDeclarationComponent
} from './personal-declaration/personal-declaration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { StartComponent } from './start/start.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { UploadDocumentBOComponent } from './upload-document-bo/upload-document-bo.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

const routes: Routes = [
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ROOT,
    redirectTo: INVESTMENT_ACCOUNT_ROUTES.START,
    pathMatch: 'full',
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.START,
    component: StartComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.SELECT_NATIONALITY,
    component: NationalityComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_INFO,
    component: PersonalInfoComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.RESIDENTIAL_ADDRESS,
    component: ResidentialAddressComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.EMPLOYMENT_DETAILS,
    component: EmploymentDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.FINANICAL_DETAILS,
    component: FinancialDetailsComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.TAX_INFO,
    component: TaxInfoComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS,
    component: UploadDocumentsComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.SETUP_PENDING,
    component: AccountStatusComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_DECLARATION,
    component: PersonalDeclarationComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONAL_DECLARATION_SCREEN_2,
    component: AdditionalDeclaration2Component,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION,
    component: AdditionalDeclarationInfoComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION_STEP1,
    component: AdditionalDeclaration1Component,
    canActivate: []
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS_BO,
    component: UploadDocumentBOComponent,
    canActivate: [InvestmentAccountGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentAccountRoutingModule {}