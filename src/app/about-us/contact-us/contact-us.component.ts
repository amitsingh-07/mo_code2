import { Component, OnInit } from '@angular/core';

import { FooterService } from './../../shared/footer/footer.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(public footerService: FooterService) { }

  ngOnInit() {
    this.footerService.setFooterVisibility(true);
  }

}
