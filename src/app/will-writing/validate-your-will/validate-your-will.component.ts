import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';

@Component({
  selector: 'app-validate-your-will',
  templateUrl: './validate-your-will.component.html',
  styleUrls: ['./validate-your-will.component.scss']
})
export class ValidateYourWillComponent implements OnInit {

  constructor(private translate: TranslateService,
              public footerService: FooterService,
              private router: Router) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.footerService.setFooterVisibility(false);
  }

}
