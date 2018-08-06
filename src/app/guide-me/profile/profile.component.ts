import 'rxjs/add/operator/map';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeService } from '../guide-me.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';

const assetImgPath = './assets/images/';

const profileHelpImages = {
  helpImg_1: 'profile-single-professional.png',
  helpImg_2: 'profile-married-with-no-kids.png',
  helpImg_3: 'profile-parent.png',
  helpImg_4: 'profile-student.png',
  helpImg_5: 'profile-retiree.png',
  helpImg_6: 'profile-homemaker.png',
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements IPageComponent, OnInit {

  pageTitle: string;
  profileForm: FormGroup;
  profileList: any[];
  helpImg: any[];
  profileFormValues: any;

  constructor(
    private guideMeService: GuideMeService, private router: Router,
    private modal: NgbModal, public headerService: HeaderService,
    public readonly translate: TranslateService) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PROFILE.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.profileFormValues = this.guideMeService.getGuideMeFormData();
    this.profileForm = new FormGroup({
      myProfile: new FormControl(this.profileFormValues.myProfile, Validators.required)
    });
    this.guideMeService.getProfileList().subscribe((data) => this.profileList = data.objectList);
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  showHelpModal(id) {
    const ref = this.modal.open(HelpModalComponent, { centered: true, windowClass: 'help-modal-dialog' });

    ref.componentInstance.description = this.profileList[id].description;
    ref.componentInstance.title = this.profileList[id].name;
    ref.componentInstance.img = assetImgPath + profileHelpImages['helpImg_' + (id + 1)];
  }

  save(form): boolean {
    if (!form.valid) {
      return false;
    }
    this.guideMeService.setProfile(this.profileForm.value);
    return true;
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.GET_STARTED]);
    }
  }
}
