import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  SIGN_UP_ROUTE_PATHS
} from '../../sign-up/sign-up.routes.constants';
import { Router } from '@angular/router';
@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.component.html',
  styleUrls: ['./refer-a-friend.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferAFriendComponent implements OnInit {
  isCollapsed = false;
  constructor(private router: Router,) {
    
   }

  ngOnInit(): void {
  }
 
  goToRewards(){
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
}
