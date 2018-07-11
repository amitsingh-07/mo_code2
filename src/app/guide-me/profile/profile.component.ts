import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GuideMeService } from '../guide-me.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profileList: any[];
  profileFormValues: any;
  constructor(private guideMeService: GuideMeService, private router: Router) {}
  ngOnInit() {
    this.profileFormValues = this.guideMeService.getGuideMeFormData();
    this.profileForm = new FormGroup({
      myProfile: new FormControl(this.profileFormValues.myProfile, Validators.required)
    });
    this.guideMeService.getProfileList().subscribe((data) => this.profileList = data.objectList);
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
      this.router.navigate(['/guideme']);
    }
  }
}
