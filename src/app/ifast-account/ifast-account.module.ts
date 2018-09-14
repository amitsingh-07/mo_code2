import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IfastAccountRoutingModule } from './ifast-account-routing.module';
import { PersonalInfoComponent } from './personal-info/personal-info.component';

@NgModule({
  imports: [
    CommonModule,
    IfastAccountRoutingModule
  ],
  declarations: [PersonalInfoComponent]
})
export class IfastAccountModule { }
