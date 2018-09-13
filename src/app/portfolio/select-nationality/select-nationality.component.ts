import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PortfolioService } from '../portfolio.service';
import { HeaderService } from '../../shared/header/header.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/http/api.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ANNOTATIONS } from '@angular/core/src/util/decorators';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-nationality',
  templateUrl: './select-nationality.component.html',
  styleUrls: ['./select-nationality.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectNationalityComponent implements OnInit {
  nationalitylist: any[];
  selectedNationality: any;
  country: any;
  afterSelectedNationality = false;
  beforeSelectedNationality = true;
  nationality = "select nationality";
  formValues: any;
  isBlocked: any;
  editPortfolio: string;
  Question = false;
  sigQuestion = false;


  constructor(
    public headerService: HeaderService,
    private portfolioService: PortfolioService,
    private modal: NgbModal,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.editPortfolio = this.translate.instant('PORTFOLIO_RECOMMENDATION.editModel');
    });
  }

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
    this.getNationalityList();



  }
  selectNationality(nationality) {
    this.nationality = nationality;
    this.isBlocked = this.nationality.isBlocked;
    this.afterSelectedNationality = true;
    this.beforeSelectedNationality = false;
    this.Question = false;
    this.sigQuestion = false;
  }

  getNationalityList() {
    this.portfolioService.getNationalityList().subscribe((data) => {
      this.nationalitylist = data.objectList;

      console.log(this.nationalitylist);




    });

  }




  goToNext() {
    if (this.nationality.isBlocked == true) {
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = this.editPortfolio.modalerror;
      ref.componentInstance.errorMessage = this.editPortfolio.modalMessage;
      console.log("saidevikosgdjas");

    } else if (this.nationality.country == 'ALAND ISLANDS') {
      this.Question = true;


    }
    else if (this.nationality.country == 'Singapore') {
      this.sigQuestion = true;
    }

  }
}