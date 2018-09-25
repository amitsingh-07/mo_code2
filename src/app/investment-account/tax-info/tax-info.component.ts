import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.scss']
})
export class TaxInfoComponent implements OnInit {
  TaxInfoForm: FormGroup;
  nationalitylist: any;
  taxInfoFormValues: any;
  nationalityObj: any;
  nationality: any;
  country: any;
  constructor(
    public headerService: HeaderService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
    });
  }

  ngOnInit() {
    this.getNationalityList();
    this.taxInfoFormValues = this.investmentAccountService.getTaxInfo();
    this.TaxInfoForm = new FormGroup({
  });
  }
  getNationalityList() {
    this.investmentAccountService.getNationalityList().subscribe((data) => {
        this.nationalitylist = data.objectList;
        console.log(this.nationalitylist);
    });

}
selectCountry(nationalityObj) {
  this.nationalityObj = nationalityObj;
  this.nationality = this.nationalityObj.nationality;
  this.country = this.nationalityObj.country;
}
}
