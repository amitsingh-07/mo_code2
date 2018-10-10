import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { AboutMeComponent } from './about-me/about-me.component';
import { AddGuardianComponent } from './add-guardian/add-guardian.component';
import { CheckEligibilityComponent } from './check-eligibility/check-eligibility.component';
import { DistributeYourEstateComponent } from './distribute-your-estate/distribute-your-estate.component';
import { FaqComponent } from './faq/faq.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { MyChildGuardianComponent } from './my-child-guardian/my-child-guardian.component';
import { MyFamilyComponent } from './my-family/my-family.component';
import { TellUsAboutYourselfComponent } from './tell-us-about-yourself/tell-us-about-yourself.component';
import { WillWritingRoutingModule } from './will-writing-routing.module';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/will-writing/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    WillWritingRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AboutMeComponent,
    AddGuardianComponent,
    CheckEligibilityComponent,
    DistributeYourEstateComponent,
    FaqComponent,
    HowItWorksComponent,
    IntroductionComponent,
    MyChildGuardianComponent,
    MyFamilyComponent,
    TellUsAboutYourselfComponent
  ]
})
export class WillWritingModule { }
