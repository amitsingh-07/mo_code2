import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { HeaderService } from '../../shared/header/header.service';
import { SignUpService } from '../sign-up.service';
@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageProfileComponent implements OnInit {
  pageTitle: any;
  entireUserData: any;
  personalData: any;
  empolymentDetails: any;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private translate: TranslateService,
    private signUpService: SignUpService,
  ) {     
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
    this.pageTitle = this.translate.instant('EDIT_PROFILE.MANAGE_PROFILE');
    this.setPageTitle(this.pageTitle);
  });
}

  ngOnInit(){
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(102);
    this.footerService.setFooterVisibility(false);
    this.setPageTitle(this.pageTitle);
    this.getEditProfileData();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  getEditProfileData() {
    this.signUpService.getEditProfileInfo().subscribe((data) => {
      const responseMessage = data.responseMessage;
      if (responseMessage.responseCode === 6000) {
        this.entireUserData = data.objectList;
        if (data.objectList) {
          if (data.objectList.personalInformation) {
            this.personalData = data.objectList.personalInformation;
          }
          this.empolymentDetails = null;
        }
      } 
    });
  }
}
