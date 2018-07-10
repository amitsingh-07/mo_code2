import { LoggerService } from './shared/logger/logger.service';
import { ConsoleLoggerService } from './shared/logger/console-logger.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [{provide: LoggerService, useClass: ConsoleLoggerService}],
  bootstrap: [AppComponent]
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
