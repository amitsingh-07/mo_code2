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
import { Router } from '@angular/router';
import { PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { SelectNationality } from './select-nationality.interface';


@Component({
  selector: 'app-select-nationality',
  templateUrl: './select-nationality.component.html',
  styleUrls: ['./select-nationality.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class SelectNationalityComponent implements OnInit {
  SelectNationality: FormGroup;
  nationalitylists: any[];
  selectedNationality: any;
  country: any;
  afterSelectedNationality = false;
  beforeSelectedNationality = true;
  nationality = "select nationality";
  formValues: any;
  blocked: any;
  editPortfolio: string;
  Question = false;
  sigQuestion = false;
  nationalitylist: any;
  selectNationalityFormValues:any;
 
  constructor(
    private formBuilder:FormBuilder,
    public headerService: HeaderService,
    public activeModal: NgbActiveModal,
    private router: Router,
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
  selectNationality(nationalitylist) {
    this.nationalitylist = nationalitylist;
    console.log(nationalitylist) +"nationlity list";
    this.blocked = this.nationalitylist.blocked;
    console.log( this.blocked +"blocked country");
    this.afterSelectedNationality = true;
    this.beforeSelectedNationality = false;
    this.Question = false;
    this.sigQuestion = false;
  }

  
getNationalityList() {
    this.portfolioService.getNationalityList().subscribe((data) => {
      this.nationalitylists = data.objectList;

      console.log(this.nationalitylists);
});

  }
  
  save(form): boolean {
    if (!form.valid) {
      return false;
    }
    // this.guideMeService.setProfile(this.profileForm.value);
    this.portfolioService.setNationality(this.SelectNationality.value)
    return true;
  }

  
  
goToNext(form) {
    if (this.nationalitylist.blocked == true) {
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = "Unable To Proceed";
      ref.componentInstance.errorMessage = "We are unable to onboard customers from the selected country online. Please contact our Client Service Team for assistance";
      ref.componentInstance.ButtonTitle = "Return To Homepage";
      ref.componentInstance.selectNationalityError =this.errorButtonNavigation();
    } 
    else if (this.nationalitylist.nationality   !==  ( this.nationalitylist.blocked  || "SINGAPOREAN"  || "AMERICAN"))  {
    
      this.Question = true;

      
    }
    else if (this.nationalitylist.nationality == 'SINGAPOREAN') {

      this.sigQuestion = true;
      this.selectNationalityFormValues = this.portfolioService.getNationality();
      this.SelectNationality = new FormGroup({
        selectNationalitySig: new FormControl(this.selectNationalityFormValues.selectNationalitySig, Validators.required),
        
        
      });
      if (this.save(form)) {
        


   if(this.SelectNationality.controls.selectNationalitySig.value !== 'no'){
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = "Unable To Proceed";
    ref.componentInstance.errorMessage = "We are unable to onboard customers from the selected country online. Please contact our Client Service Team for assistance";
    ref.componentInstance.ButtonTitle = "Return To Homepage";

   }else{
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.FUND_DETAILS]);
   }




     
        
      }
  
      
    }
    else if(this.nationalitylist.country == 'UNITED STATES OF AMERICA'){
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = "Unable To Proceed";
      ref.componentInstance.errorMessage = "We are unable to onboard customers from the selected country online. Please contact our Client Service Team for assistance";
      ref.componentInstance.ButtonTitle = "Return To Homepage";
      ref.componentInstance.selectNationalityError =this.errorButtonNavigation();
    }
   
  }
  errorButtonNavigation(){
    this.activeModal.dismiss('Cross click');
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.SELECT_NATIONALITY]);
  }

}

