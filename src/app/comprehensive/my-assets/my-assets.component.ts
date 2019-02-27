import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements OnInit {
  RSPForm: any;
  pageTitle: string;
  myAssetsForm: FormGroup;
  myInvestmentProperties = true;
  investmentTypeList: any;
  investType = '';
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService) {
this.configService.getConfig().subscribe((config) => {
this.translate.setDefaultLang(config.language);
this.translate.use(config.language);
});
this.translate.get('COMMON').subscribe((result: string) => {
// meta tag and title
this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');
this.investmentTypeList = this.translate.instant('CMP.MY_ASSETS.INVESTMENT_TYPE_LIST');

this.setPageTitle(this.pageTitle);
});

}
setPageTitle(title: string) {
  this.navbarService.setPageTitle(title);
}
  ngOnInit() {
    this.buildMyAssetsForm();
  }
  buildMyAssetsForm() {
    this.myAssetsForm = this.formBuilder.group({
      cashInBank: ['', [Validators.required]],
      singaporeSavingsBond: ['', [Validators.required]],
      CPFOA: ['', [Validators.required]],
      CPFSA: ['', [Validators.required]],
      CPFMA: ['', [Validators.required]],
      yourHome: ['', [Validators.required]],
      investmentProperties: ['', [Validators.required]],
      otherinvestment: this.formBuilder.array([this.buildInvestmentForm()]),
      otherAssets: ['', [Validators.required]]
    });
  }
  addOtherInvestment() { 
    this.myInvestmentProperties = !this.myInvestmentProperties;

  }
  addInvestment() {
    const investments = this.myAssetsForm.get('otherinvestment') as FormArray;
    investments.push(this.buildInvestmentForm());
  }
  buildInvestmentForm() {
    return this.formBuilder.group({
      investmentType: ['', [Validators.required]],
      others: ['', [Validators.required]]
    });
  }
  removeInvestment(i) {
    const investments = this.myAssetsForm.get('otherinvestment') as FormArray;
    investments.removeAt(i);
  }
  selectInvestType(investType, i) {
    investType = investType ? investType : { text: '', value: '' };
    this.investType = investType.text;
    console.log(this.investType);
    this.myAssetsForm.controls['otherinvestment']['controls'][i].controls.investmentType.setValue(investType.value);
    this.myAssetsForm.markAsDirty();
  }

  goToNext(form) {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES]);
  }
}
