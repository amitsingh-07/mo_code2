import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CorporateRoutingModule } from './corporate-routing.module';
import { FinancialLiteracyTeamComponent } from './financial-literacy-team/financial-literacy-team.component';
import { FinancialWellnessProgrammeComponent } from './financial-wellness-programme/financial-wellness-programme.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    CorporateRoutingModule,
    RouterModule,
  ],
  declarations: [
    FinancialWellnessProgrammeComponent, 
    FinancialLiteracyTeamComponent
  ]
})
export class CorporateModule { }
