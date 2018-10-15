import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-beneficiaries',
  templateUrl: './my-beneficiaries.component.html',
  styleUrls: ['./my-beneficiaries.component.scss']
})
export class MyBeneficiariesComponent implements OnInit {

  constructor(private translate: TranslateService) {
    this.translate.use('en');
   }

  ngOnInit() {
  }

}
