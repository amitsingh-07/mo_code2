import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DynamicScriptLoaderService } from '../shared/Services/dynamic-script-loader.service';
import { ModelWithButtonComponent } from '../shared/modal/model-with-button/model-with-button.component';
import { SingpassService } from './singpass.service';

@Component({
  selector: 'app-singpass',
  templateUrl: './singpass.component.html',
  styleUrls: ['./singpass.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingPassComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() showSingpassLogin: boolean;
  
  constructor(
    public translate: TranslateService,
    private modal: NgbModal,
    private singpassService: SingpassService,
    private dynamicScriptLoaderService: DynamicScriptLoaderService) {
    this.translate.use('en');
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.dynamicScriptLoaderService.load('singpass-ndi').then(data => {
      // Script Loaded Successfully
      if (data[0]['loaded']) {
        this.singpassService.initSingPassQR();
      }
    }).catch(error => console.error(error));
  }

  ngOnDestroy() {
    this.dynamicScriptLoaderService.unload('singpass-ndi').then(data => {
    }).catch(error => console.error(error));
  }

  openSingpassModal(event) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('LOGIN.SINGPASS_ACTIVATE_MODAL.TITLE');
    ref.componentInstance.errorMessageHTML = this.translate.instant('LOGIN.SINGPASS_ACTIVATE_MODAL.MESSAGE');
    event.stopPropagation();
    event.preventDefault();
  }

}
