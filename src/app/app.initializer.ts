import { Injector } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from './../environments/environment';

export function onAppInit(injector: Injector): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise<void>((resolve, reject) => {
      const router = injector.get(Router);
      if (environment.hideHomepage) {
        const userPermittedRoutes = router.config[0].children.filter((i) => {
          if (i.path === '') {
            //i.redirectTo = 'accounts/login2';
            i.redirectTo = 'accounts/login';
          }
          return i.path !== 'home'  && i.path !== 'learn';
        });
        router.resetConfig(userPermittedRoutes);
      }
      resolve();
    });
  };
}
