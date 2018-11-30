import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  // Specific Prod Tools
  enableProdMode();
  document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=' + environment.gtagPropertyId + '"></script>');
  document.write('<script>' +
                  'window.dataLayer = window.dataLayer || [];  function gtag(){dataLayer.push(arguments);}' +
                  'gtag("js", new Date()); gtag("config", "' + environment.gtagPropertyId + '");</script>');
  document.write('<script type="text/javascript">fbq("init", "' + environment.fbPropertyId + '");</script>');
}
document.write('<script type="text/javascript">ga("create", "' + environment.gaPropertyId + '", "auto");</script>');
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.log(err));
