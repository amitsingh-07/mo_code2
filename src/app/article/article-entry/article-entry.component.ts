import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  , Router } from '@angular/router';

import { FooterService } from './../../shared/footer/footer.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-article-entry',
  templateUrl: './article-entry.component.html',
  styleUrls: ['./article-entry.component.scss']
})
export class ArticleEntryComponent implements OnInit {
  private art_id: number;

  constructor(public navbarService: NavbarService, public footerService: FooterService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log(params['id']);
    });
    this.route.queryParams.subscribe((params) => {
      console.log(params['art_id']);
    });

    this.navbarService.setNavbarMode(1);
    this.footerService.setFooterVisibility(true);
  }

}
