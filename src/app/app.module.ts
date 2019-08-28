import 'hammerjs';

import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import {
    CurrencyPipe, HashLocationStrategy, LocationStrategy, TitleCasePipe
} from '@angular/common';
import {
    HTTP_INTERCEPTORS, HttpClient, HttpClientJsonpModule, HttpClientModule
} from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appConstants } from './app.constants';
import { AppService } from './app.service';
import { ArticleChildEnableGuard } from './article/article-child-enable-guard';
import { ArticleEnableGuard } from './article/article-enable-guard';
import { ArticleService } from './article/article.service';
import { CallBackComponent } from './call-back/call-back.component';
import { PendingChangesGuard } from './changes.guard';
import { FAQComponent } from './faq/faq.component';
import { HelpModalComponent } from './guide-me/help-modal/help-modal.component';
import {
    ExistingCoverageModalComponent
} from './guide-me/insurance-results/existing-coverage-modal/existing-coverage-modal.component';
import {
    RestrictAlphabetsDirective
} from './guide-me/insurance-results/existing-coverage-modal/restrict-alphabets.directive';
import {
    InsuranceResultModalComponent
} from './guide-me/insurance-results/insurance-result-modal/insurance-result-modal.component';
import {
    LifeProtectionModalComponent
} from './guide-me/life-protection/life-protection-form/life-protection-modal/life-protection-modal.component';
import { MobileModalComponent } from './guide-me/mobile-modal/mobile-modal.component';
import {
    CreateAccountModelComponent
} from './guide-me/recommendations/create-account-model/create-account-model.component';
import { HammerConfig } from './hammer.config';
import { HomeComponent } from './home/home.component';
import { FundDetailsComponent } from './investment/investment-engagement-journey/fund-details/fund-details.component';
import { InvestmentChildEnableGuard } from './investment/investment-engagement-journey/investment-child-enable-guard';
import { InvestmentEnableGuard } from './investment/investment-engagement-journey/investment-enable-guard';
import { PromotionChildEnableGuard } from './promotion/promotion-child-enable-guard';
import { PromotionEnableGuard } from './promotion/promotion-enable-guard';
import { TermsComponent } from './shared/components/terms/terms.component';
import {
    WillDisclaimerComponent
} from './shared/components/will-disclaimer/will-disclaimer.component';
import { NumberOnlyDirective } from './shared/directives/number-only.directive';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { AuthenticationService } from './shared/http/auth/authentication.service';
import { JwtInterceptor } from './shared/http/auth/jwt.interceptor';
import { CustomErrorHandlerService } from './shared/http/custom-error-handler.service';
import { RequestCache } from './shared/http/http-cache.service';
import { ConsoleLoggerService } from './shared/logger/console-logger.service';
import { LoggerService } from './shared/logger/logger.service';
import { BankDetailsComponent } from './shared/modal/bank-details/bank-details.component';
import {
    ConfirmationModalComponent
} from './shared/modal/confirmation-modal/confirmation-modal.component';
import { DiyModalComponent } from './shared/modal/diy-modal/diy-modal.component';
import { DefaultErrors } from './shared/modal/error-modal/default-errors';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { LoaderComponent } from './shared/modal/loader/loader.component';
import {
    ModelWithButtonComponent
} from './shared/modal/model-with-button/model-with-button.component';
import { PopupModalComponent } from './shared/modal/popup-modal/popup-modal.component';
import {
    RecommendationsModalComponent
} from './shared/modal/recommendations-modal/recommendations-modal.component';

import { SuccessModalComponent } from './shared/modal/success-modal/success-modal.component';
import { ToolTipModalComponent } from './shared/modal/tooltip-modal/tooltip-modal.component';

import {
    TransactionModalComponent
} from './shared/modal/transaction-modal/transaction-modal.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { TermsModalComponent } from './shared/modal/terms-modal/terms-modal.component';
import {
    UnsupportedDeviceModalComponent
} from './shared/modal/unsupported-device-modal/unsupported-device-modal.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RoutingService } from './shared/Services/routing.service';
import { StateStoreService } from './shared/Services/state-store.service';
import { SharedModule } from './shared/shared.module';
import { Formatter } from './shared/utils/formatter.util';
import { Util } from './shared/utils/util';
import {
    SettingsWidgetComponent
} from './shared/widgets/settings-widget/settings-widget.component';
import { SignUpService } from './sign-up/sign-up.service';
import { TestMyInfoComponent } from './test-my-info/test-my-info.component';
import { UrlRedirectComponent } from './url-redirect.component';
import { WillWritingChildEnableGuard } from './will-writing/will-writing-child-enable-guard';
import { WillWritingEnableGuard } from './will-writing/will-writing-enable-guard';
import { EmailEnquirySuccessComponent } from './email-enquiry-success/email-enquiry-success.component';
import { NavbarService } from './shared/navbar/navbar.service';

import { RestrictAddPortfolioModalComponent } from './investment/manage-investments/investment-overview/restrict-add-portfolio-modal/restrict-add-portfolio-modal.component';

// tslint:disable-next-line:max-line-length
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/home/', suffix: '.json' },
      { prefix: './assets/i18n/faq/', suffix: '.json' }
    ]);
}

export function tokenGetterFn() {
  return sessionStorage.getItem(appConstants.APP_JWT_TOKEN_KEY);
}

@NgModule({
  declarations: [
    AppComponent,
    HelpModalComponent,
    MobileModalComponent,
    LoaderComponent,
    ErrorModalComponent,
    BankDetailsComponent,
    ToolTipModalComponent,
    ModelWithButtonComponent,
    LifeProtectionModalComponent,
    InsuranceResultModalComponent,
    CreateAccountModelComponent,
    ExistingCoverageModalComponent,
    DiyModalComponent,
    PopupModalComponent,
    SuccessModalComponent,
    RestrictAlphabetsDirective,
    jqxSliderComponent,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    NumberOnlyDirective,
    CallBackComponent,
    HomeComponent,
    UrlRedirectComponent,
    TestMyInfoComponent,
    TransactionModalComponent,
    FAQComponent,
    FundDetailsComponent,
    UnsupportedDeviceModalComponent,
    NotFoundComponent,
    EmailEnquirySuccessComponent,
    RestrictAddPortfolioModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetterFn
      }
    }),
  ],
  providers: [
    NgbActiveModal, AuthenticationService, CustomErrorHandlerService, RequestCache,
    AppService, TitleCasePipe, PendingChangesGuard, DefaultErrors,
    ArticleService,
    { provide: LoggerService, useClass: ConsoleLoggerService },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
      deps: [AuthenticationService, RequestCache, CustomErrorHandlerService, Router, NavbarService]
    }, Formatter, CurrencyPipe, RoutingService,
    StateStoreService, Util,
    InvestmentEnableGuard,
    InvestmentChildEnableGuard,
    WillWritingEnableGuard,
    WillWritingChildEnableGuard,
    PromotionEnableGuard,
    PromotionChildEnableGuard,
    ArticleEnableGuard,
    ArticleChildEnableGuard,
    SignUpService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    HelpModalComponent, LoaderComponent, ErrorModalComponent, BankDetailsComponent, ToolTipModalComponent, ModelWithButtonComponent,
    LifeProtectionModalComponent, MobileModalComponent, InsuranceResultModalComponent, PopupModalComponent, DiyModalComponent,
    CreateAccountModelComponent, ExistingCoverageModalComponent, RecommendationsModalComponent, TermsModalComponent,
    SettingsWidgetComponent, ConfirmationModalComponent, TermsComponent, WillDisclaimerComponent, TransactionModalComponent,
    FundDetailsComponent, UnsupportedDeviceModalComponent, RestrictAddPortfolioModalComponent]
})

export class AppModule {
  /**
   * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
   * This is good to prevent injecting the service as constructor parameter.
   */
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;

  }
}
