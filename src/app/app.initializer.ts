import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from './../environments/environment';

export function onAppInit(injector: Injector): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const router = injector.get(Router);
      if (environment.hideHomepage) {
        const userPermittedRoutes = router.config[0].children.filter((i) => {
          if (i.path === '') {
            i.redirectTo = 'accounts/login';
          }
          return i.path !== 'home'  && i.path !== 'learn' && i.path !== 'terms-of-use'
          && i.path !== 'privacy-policy' && i.path !== 'disclosures'
          && i.path !== 'fair-dealing' && i.path !== 'security-policy';
        });
        router.resetConfig(userPermittedRoutes);
      }
      resolve();
    });
  };
}
