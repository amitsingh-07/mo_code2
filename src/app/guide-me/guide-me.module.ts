import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { GuideMeRoutingModule } from './/guide-me-routing.module';

@NgModule({
  imports: [
    CommonModule,
    GuideMeRoutingModule
  ],
  declarations: [ProfileComponent]
})
export class GuideMeModule { }
