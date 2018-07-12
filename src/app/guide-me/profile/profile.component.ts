import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { GuideMeService } from '../guide-me.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { HeaderService } from './../../shared/header/header.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements IPageComponent, OnInit {

  pageTitle: string;
  profileForm: FormGroup;
  profileList: any[];
  helpImg: any[];
  profileFormValues: any;

  constructor(private guideMeService: GuideMeService, private router: Router,
              private modal: NgbModal, public headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.setPageTitle('Profile Component Page');
    this.profileFormValues = this.guideMeService.getGuideMeFormData();
    this.profileForm = new FormGroup({
      myProfile: new FormControl(this.profileFormValues.myProfile, Validators.required)
    });
    this.guideMeService.getProfileList().subscribe((data) => this.profileList = data.objectList);
  }

  showHelpModal(id) {
    const ref = this.modal.open(HelpModalComponent);

    ref.componentInstance.description = this.profileList[id].description;
    ref.componentInstance.title = this.profileList[id].name;
    ref.componentInstance.img = 'helpImg_' + (id + 1) + '.jpg';
  }

  save(form): boolean {
    if (!form.valid) {
      return false;
    }
    this.guideMeService.setProfile(this.profileForm.value);
    return true;
  }
  goToInfo(form) {
    if (this.save(form)) {
      this.router.navigate(['/guideme/get-started']);
    }
  }
}
