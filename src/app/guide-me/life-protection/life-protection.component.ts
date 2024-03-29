import { Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GuideMeService } from '../guide-me.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { GUIDE_ME_CONSTANTS } from '../guide-me.constants';

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
  modalImage: 'occupationdisability_modal.png';

  dependentCountOptions = GUIDE_ME_CONSTANTS.DEPENDENT_COUNT;

  constructor(
    public navbarService: NavbarService, private formBuilder: FormBuilder,
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
    this.navbarService.setNavbarDirectGuided(true);
    const dependantCount = this.guideMeService.getUserInfo().dependent ? this.guideMeService.getUserInfo().dependent : 0;
    this.lpDependentCountForm = this.formBuilder.group({
      dependentCount: dependantCount
    });
    this.subscription = this.navbarService.currentMobileModalEvent.subscribe((event) => {
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
    this.guideMeService.decrementProtectionNeedsIndex();
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.navbarService.setPageTitle(title, null, helpIcon);
  }

  setDropDownDependentCount(value, i) {
    this.lpDependentCountForm.controls.dependentCount.setValue(value);
    this.guideMeService.updateDependentCount(value);
  }
  showMobilePopUp() {
    const ref = this.modal.open(HelpModalComponent, { centered: true });
    ref.componentInstance.description = this.modalData.description;
    ref.componentInstance.title = this.modalData.title;
    ref.componentInstance.img = assetImgPath + this.modalData.imageName;
    this.navbarService.showMobilePopUp('removeClicked');
  }

}
