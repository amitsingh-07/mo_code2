import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { HeaderService } from './../../shared/header/header.service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
import { GuideMeService } from './../guide-me.service';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-life-protection',
  templateUrl: './life-protection.component.html',
  styleUrls: ['./life-protection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LifeProtectionComponent implements IPageComponent, OnInit , OnDestroy {

  subscription: Subscription;
  pageTitle: string;
  lpDependentCountForm;
  modalData: any;

  dependentCountOptions = [0, 1, 2, 3, 4, 5];

  constructor(
    public headerService: HeaderService, private formBuilder: FormBuilder,
    public translate: TranslateService, public guideMeService: GuideMeService , public modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('LIFE_PROTECTION.TITLE');
      this.modalData = this.translate.instant('LIFE_PROTECTION.MODAL_DATA');
      this.setPageTitle(this.pageTitle, null, true);
    });
  }

  ngOnInit() {
    this.headerService.setPageTitle(this.pageTitle);

    const dependantCount = this.guideMeService.getUserInfo().dependent ? this.guideMeService.getUserInfo().dependent : 0;
    this.lpDependentCountForm = this.formBuilder.group({
      dependentCount: dependantCount
    });
    this.subscription = this.headerService.currentMobileModalEvent.subscribe((event) => {
      if (event === this.pageTitle) {
        this.showMobilePopUp();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.protectionNeedsPageIndex--;
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  setDropDownDependentCount(value, i) {
    this.lpDependentCountForm.controls.dependentCount.setValue(value);
  }
  showMobilePopUp() {
    console.log('Show Mobile Popup Triggered');
    const ref = this.modal.open(HelpModalComponent, { centered: true, windowClass: 'help-modal-dialog' });
    ref.componentInstance.description = this.modalData.description;
    ref.componentInstance.title = this.modalData.title;
    ref.componentInstance.img = assetImgPath + this.modalData.imageName;
    this.headerService.showMobilePopUp('removeClicked');
  }

}
