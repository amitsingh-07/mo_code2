import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { GuideMeRoutingModule } from './/guide-me-routing.module';
import { GetStartedComponent } from './get-started/get-started.component';
import { GetStartedFormComponent } from './get-started-form/get-started-form.component';

@NgModule({
  imports: [
    CommonModule,
    GuideMeRoutingModule
  ],
  declarations: [ProfileComponent, GetStartedComponent, GetStartedFormComponent]
})
export class GuideMeModule { }
