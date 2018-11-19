import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
import { ConfigService, IConfig } from './../../config/config.service';
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
  useMyInfo: boolean;
  cpfFromMyInfo = false;

  constructor(
    private router: Router, public navbarService: NavbarService,
    private modal: NgbModal, private location: Location,
    private myInfoService: MyInfoService,
    public guideMeApiService: GuideMeApiService, private configService: ConfigService,
    private guideMeService: GuideMeService, private translate: TranslateService,
    private route: ActivatedRoute) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_ASSETS.TITLE');
      this.setPageTitle(this.pageTitle);
    });

    this.configService.getConfig().subscribe((config: IConfig) => {
      this.useMyInfo = config.useMyInfo;
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
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
    this.route.params.subscribe((params) => {
      if (params.myinfo) {
        this.myInfoService.openFetchPopup();
        if (params.myinfo === 'SUCCESS' && this.myInfoService.isMyInfoEnabled) {
          this.myInfoService.getMyInfoData().subscribe((data) => {
            if (data && data['objectList']) {
              this.cpfValue = Math.floor(data['objectList'][0].cpfbalances.total);
              this.assetsForm.controls['cpf'].setValue(this.cpfValue);
              this.myInfoService.isMyInfoEnabled = false;
              this.cpfFromMyInfo = true;
              this.setFormTotalValue();
              this.closeMyInfoPopup(false);
            } else {
              this.closeMyInfoPopup(true);
            }
          }, (error) => {
            this.closeMyInfoPopup(true);
          });
        } else {
          this.closeMyInfoPopup(true);
        }
      }
    });

    this.setFormTotalValue();
  }
  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }

  setFormTotalValue() {
    this.assetsTotal = this.guideMeService.additionOfCurrency(this.assetsForm.value);
  }

  closeMyInfoPopup(error: boolean) {
    this.myInfoService.closeFetchPopup();
    if (error) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = 'Oops, Error!';
      ref.componentInstance.errorMessage = 'We weren’t able to fetch your data from MyInfo.';
      ref.componentInstance.isError = true;
      ref.result.then(() => {
        this.myInfoService.goToMyInfo();
      }).catch((e) => {
      });
    }
  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  save(form: any) {
    Object.keys(form.value).forEach((key) => {
      if (!form.value[key] || isNaN(form.value[key])) {
        form.value[key] = 0;
      }
    });
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
