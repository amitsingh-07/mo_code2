import { Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';

import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { GUIDE_ME_ROUTE_PATHS} from '../guide-me-routes.constants';
import { GuideMeApiService } from '../guide-me.api.service';
import { GuideMeService } from '../guide-me.service';
import { ConfigService, IConfig } from './../../config/config.service';
import { IMyAssets } from './my-assets.interface';
import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';
import { appConstants } from './../../app.constants';

@Component({
  selector: 'app-my-assets',
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements IPageComponent, OnInit, OnDestroy, AfterViewInit {
  myinfoChangeListener: Subscription;
  pageTitle: string;
  assetsForm: FormGroup;
  assetsFormValues: IMyAssets;
  assetsTotal: any;
  cpfValue: number;
  useMyInfo: boolean;
  cpfFromMyInfo = false;
  myinfoRetrieved = this.myInfoService.myinfoValueRetrieved$.value;

  constructor(
    private router: Router, public navbarService: NavbarService,
    private modal: NgbModal, private location: Location,
    private myInfoService: MyInfoService,
    public guideMeApiService: GuideMeApiService, private configService: ConfigService,
    private guideMeService: GuideMeService, private translate: TranslateService,
    private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) {
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
    this.assetsFormValues = Object.keys(this.guideMeService.getMyAssetsTempData()).length > 0 ? this.guideMeService.getMyAssetsTempData() : this.guideMeService.getMyAssets();
    this.assetsForm = new FormGroup({
      cash: new FormControl(this.assetsFormValues.cash),
      cpf: new FormControl(this.assetsFormValues.cpf),
      cpfFromMyInfo: new FormControl(this.cpfFromMyInfo),
      homeProperty: new FormControl(this.assetsFormValues.homeProperty),
      investmentProperties: new FormControl(this.assetsFormValues.investmentProperties),
      otherInvestments: new FormControl(this.assetsFormValues.otherInvestments),
      otherAssets: new FormControl(this.assetsFormValues.otherAssets)
    });
    if(this.myinfoRetrieved) {
      this.cpfValue = this.myInfoService.getMyInfoCpfbalances()?.cpfbalances?.total;
      this.assetsForm.controls['cpf'].setValue(this.cpfValue);
      this.cpfFromMyInfo = true;
      this.assetsForm.controls['cpfFromMyInfo'].setValue(this.cpfFromMyInfo);
      this.setFormTotalValue();
    }
    this.myInfoService.myinfoValueRetrieved$.next(false);
    this.guideMeService.setMyAssetsTempData(null);
    this.myinfoChangeListener = this.myInfoService.changeListener.subscribe((myinfoObj: any) => {
      if (myinfoObj && myinfoObj !== '' && this.myInfoService.checkMyInfoSourcePage()) {
        if (myinfoObj.status && myinfoObj.status === 'SUCCESS' && this.myInfoService.isMyInfoEnabled) {
          this.myInfoService.getMyInfoData().subscribe((data) => {
            if (data && data['objectList']) {
              this.myInfoService.setMyInfoCpfbalances(data['objectList'][0]);
              this.myInfoService.isMyInfoEnabled = false;
              this.guideMeService.setMyAssetsTempData(this.assetsForm.value);
              this.closeMyInfoPopup();
              this.router.navigate([GUIDE_ME_ROUTE_PATHS.MYINFO_RETRIEVAL]);
            } else {
              this.closeMyInfoPopup();
            }
          }, (error) => {
            this.closeMyInfoPopup();
          });
        } else {
          this.myInfoService.isMyInfoEnabled = false;
          this.closeMyInfoPopup();
        }
      }
    });

    this.setFormTotalValue();
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.myinfoChangeListener) {
      this.myinfoChangeListener.unsubscribe();
    }
  }

  setFormTotalValue() {
    this.assetsTotal = this.guideMeService.additionOfCurrency(this.assetsForm.value);
  }

  closeMyInfoPopup() {
    this.myInfoService.closeFetchPopup();
    this.myInfoService.changeListener.next('');
    if (this.myInfoService.isMyInfoEnabled) {
      this.myInfoService.isMyInfoEnabled = false;
      const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'my-info' });
      ref.componentInstance.errorTitle = this.translate.instant('MYINFO.ERROR_MODAL_DATA.TITLE');
      ref.componentInstance.errorMessage = this.translate.instant('MYINFO.ERROR_MODAL_DATA.DESCRIPTION');
      ref.componentInstance.isMyinfoError = true;
      ref.componentInstance.closeBtn = false;
      ref.result.then(() => {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      }).catch((e) => {
      });
    }
  }

  /* Onchange Currency Addition */
  @HostListener('input', ['$event'])
  onChange() {
    this.setFormTotalValue();
  }

  // Skipping myinfo details page
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.router.navigate([GUIDE_ME_ROUTE_PATHS.EXPENSES])
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
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('MYINFO.OPEN_MODAL_DATA.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('MYINFO.OPEN_MODAL_DATA.DESCRIPTION');
    ref.componentInstance.primaryActionLabel = this.translate.instant('MYINFO.OPEN_MODAL_DATA.BTN-TEXT');
    ref.result.then(() => {
      this.myInfoService.setMyInfoAttributes('cpfbalances');
      this.myInfoService.setMyInfoAppId(appConstants.MYINFO_CPF);
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
