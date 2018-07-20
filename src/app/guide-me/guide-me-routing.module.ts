import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetStartedComponent } from './get-started/get-started.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'getstarted', component: GetStartedComponent },
  { path: 'protectionneeds', component: ProtectionNeedsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule {}
