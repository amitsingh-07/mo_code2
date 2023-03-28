import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  /* Header Params */
  private loaderParams = new BehaviorSubject({} as any);

  loaderParamChange = this.loaderParams.asObservable();

  constructor() { }

  showLoader(param) {
    this.loaderParams.next(param);
  }

  hideLoader() {
    this.loaderParams.next('');
  }

  hideLoaderForced() {
    this.loaderParams.next({hideForced: true});
  }

}
