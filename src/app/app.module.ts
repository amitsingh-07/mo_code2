import { LoggerService } from './shared/logger/logger.service';
import { ConsoleLoggerService } from './shared/logger/console-logger.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [{provide: LoggerService, useClass: ConsoleLoggerService}],
  bootstrap: [AppComponent]
})
export class AppModule {
  /**
     * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
     * This is good to prevent injecting the service as constructor parameter.
     */static injector: Injector;
     constructor(injector: Injector) {
      AppModule.injector = injector;
    }
}
