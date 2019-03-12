import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../sign-up/auth-guard.service';
import { AccountSetupCompletedComponent } from './account-setup-completed/account-setup-completed.component';
import { AccountSetupPendingComponent } from './account-setup-pending/account-setup-pending.component';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { AdditionalDeclarationInfoComponent } from './additional-declaration-info/additional-declaration-info.component';
import {
  AdditionalDeclarationScreen2Component,
} from './additional-declaration-screen2/additional-declaration-screen2.component';
import { AdditionalDeclarationStep1Component } from './additional-declaration-step1/additional-declaration-step1.component';
import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { FinanicalDetailsComponent } from './finanical-details/finanical-details.component';
import { FundingIntroComponent } from './funding-intro/funding-intro.component';
import { INVESTMENT_ACCOUNT_ROUTES } from './investment-account-routes.constants';
import { InvestmentGuardService as InvestmentGuard } from './investment-guard.service';
import { PersonalDeclarationComponent } from './personal-declaration/personal-declaration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PostLoginComponent } from './post-login/post-login.component';
import { ResidentialAddressComponent } from './residential-address/residential-address.component';
import { SelectNationalityComponent } from './select-nationality/select-nationality.component';
import { TaxInfoComponent } from './tax-info/tax-info.component';
import { UploadDocumentBOComponent } from './upload-document-bo/upload-document-bo.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

const routes: Routes = [
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ROOT,
    redirectTo: INVESTMENT_ACCOUNT_ROUTES.POSTLOGIN,
    pathMatch: 'full',
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.POSTLOGIN,
    component: PostLoginComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.SELECT_NATIONALITY,
    component: SelectNationalityComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_INFO,
    component: PersonalInfoComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.RESIDENTIAL_ADDRESS,
    component: ResidentialAddressComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.EMPLOYMENT_DETAILS,
    component: EmploymentDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.FINANICAL_DETAILS,
    component: FinanicalDetailsComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.TAX_INFO,
    component: TaxInfoComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS,
    component: UploadDocumentsComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.SETUP_PENDING,
    component: AccountSetupPendingComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.PERSONAL_DECLARATION,
    component: PersonalDeclarationComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONAL_DECLARATION_SCREEN_2,
    component: AdditionalDeclarationScreen2Component,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.CONFIRM_PORTFOLIO,
    component: ConfirmPortfolioComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ACKNOWLEDGEMENT,
    component: AcknowledgementComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION,
    component: AdditionalDeclarationInfoComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION_STEP1,
    component: AdditionalDeclarationStep1Component,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.SETUP_COMPLETED,
    component: AccountSetupCompletedComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS_BO,
    component: UploadDocumentBOComponent,
    canActivate: [InvestmentGuard]
  },
  {
    path: INVESTMENT_ACCOUNT_ROUTES.FUND_INTRO,
    component: FundingIntroComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentAccountRoutingModule {}