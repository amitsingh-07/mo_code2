import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  showNavbar = true;
  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
    console.log(this.showNavbar);
  }

  ngAfterViewInit() {
    this.navbarService.currentNavbarVisibility.subscribe((showNavbar) => {
      console.log('Before:' + this.showNavbar);
      this.showNavbar = showNavbar;
      console.log(this.showNavbar);
    });
  }
}
