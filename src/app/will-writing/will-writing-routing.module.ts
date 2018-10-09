import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FaqComponent } from './faq/faq.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { WILL_WRITING_ROUTES } from './will-writing-routes.constants';

const routes: Routes = [
  { path: WILL_WRITING_ROUTES.ROOT, component: IntroductionComponent },
  { path: WILL_WRITING_ROUTES.INTRODUCTION, component: IntroductionComponent },
  { path: WILL_WRITING_ROUTES.FAQ, component: FaqComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class WillWritingRoutingModule {}
