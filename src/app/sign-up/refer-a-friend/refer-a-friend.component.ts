import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  SIGN_UP_ROUTE_PATHS
} from '../../sign-up/sign-up.routes.constants';
import { Router } from '@angular/router';
import { NavbarService } from '../../shared/navbar/navbar.service';
@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.component.html',
  styleUrls: ['./refer-a-friend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferAFriendComponent implements OnInit {
  isCollapsed: boolean = false;
  pageTitle: string;
  constructor(
    private router: Router,
    public navbarService: NavbarService,
    ) {
    this.pageTitle = "Refer a friend";
    this.setPageTitle(this.pageTitle);
   }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
  }
 

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }


  goToRewards(){
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }

  toggleinfo(event) {
    this.isCollapsed = !this.isCollapsed;
  }
}
