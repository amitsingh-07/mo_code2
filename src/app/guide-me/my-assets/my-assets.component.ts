import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
import { IMyAssets } from './my-assets.interface';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements IPageComponent, OnInit, OnDestroy {
  locationSubscription: any;
  pageTitle: string;
  assetsForm: FormGroup;
  assetsFormValues: IMyAssets;
  assetsTotal: any;
  cpfValue: number;

  constructor(
    private router: Router, public navbarService: NavbarService,
    private modal: NgbModal, private location: Location,
    private myInfoService: MyInfoService,
    public guideMeApiService: GuideMeApiService,
    private guideMeService: GuideMeService, private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_ASSETS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.locationSubscription = this.location.subscribe(() => this.router.navigate([GUIDE_ME_ROUTE_PATHS.EXPENSES]));
    this.assetsFormValues = this.guideMeService.getMyAssets();
    this.assetsForm = new FormGroup({
      cash: new FormControl(this.assetsFormValues.cash),
      cpf: new FormControl(this.assetsFormValues.cpf),
      homeProperty: new FormControl(this.assetsFormValues.homeProperty),
      investmentProperties: new FormControl(this.assetsFormValues.investmentProperties),
      otherInvestments: new FormControl(this.assetsFormValues.otherInvestments),
      otherAssets: new FormControl(this.assetsFormValues.otherAssets)
    });
    if (this.guideMeService.isMyInfoEnabled) {
      this.guideMeApiService.getMyInfoData().subscribe((data) => {
        this.cpfValue = Math.floor(data['person'].cpfcontributions.cpfcontribution.slice(-1)[0]['amount']);
        this.guideMeService.closeFetchPopup();
        this.assetsForm.controls['cpf'].setValue(this.cpfValue);
        this.guideMeService.isMyInfoEnabled = false;
        this.setFormTotalValue();
      });
      }
    this.setFormTotalValue();
    }
    ngOnDestroy(): void {
      this.locationSubscription.unsubscribe();
    }

  setFormTotalValue() {
    this.assetsTotal = this.guideMeService.additionOfCurrency(this.assetsForm.value);
  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  save(form: any) {
    this.guideMeService.setMyAssets(form.value);
    return true;
  }

  openModal() {
     const ref = this.modal.open(ErrorModalComponent, { centered: true });
     ref.componentInstance.errorTitle = this.translate.instant('MYINFO.OPEN_MODAL_DATA.TITLE');
     ref.componentInstance.errorMessage = this.translate.instant('MYINFO.OPEN_MODAL_DATA.DESCRIPTION');
     ref.componentInstance.isButtonEnabled = true;
     ref.result.then(() => {
       this.myInfoService.setMyInfoAttributes('cpfbalances');
       this.myInfoService.goToMyInfo();
    }).catch((e) => {
    });

   }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.LIABILITIES]);
    }
  }
}
