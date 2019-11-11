import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

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
