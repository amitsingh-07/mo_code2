import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subscription } from 'rxjs';

import { NavbarService } from '../../shared/navbar/navbar.service';
import { GuideMeService } from '../guide-me.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { IMyIncome } from '../income/income.interface';
import { IMyOcpDisability } from './ocp-disability.interface';

const assetImgPath = './assets/images/';

@Component({
  selector: 'app-ocp-disability',
  templateUrl: './ocp-disability.component.html',
  styleUrls: ['./ocp-disability.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OcpDisabilityComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ocpDisabilitySlider') ocpDisabilitySlider: NouisliderComponent;
  pageTitle: string;
  ocpDisabilityForm: FormGroup;
  liabilitiesTotal: number;
  formValues: IMyOcpDisability;
  modalData: any;
  pageData;
  employeeList;
  defaultEmployee;
  retirementAge = 65;
  retirementAgeItems = Array(3).fill(55).map((x, i) => x += i * 5);
  coveragePercent = 75;
  coverageMax = 75;
  coverageAmount = 0;
  monthlyIncome: IMyIncome;

  ciSliderConfig: any = {
    behaviour: 'snap',
    start: 0,
    connect: [true, false],
    format: {
      to: (value) => {
        return Math.round(value);
      },
      from: (value) => {
        return Math.round(value);
      }
    }
  };

  private subscription: Subscription;

  constructor(
    private router: Router, public navbarService: NavbarService,
    private guideMeService: GuideMeService, private translate: TranslateService,
    public modal: NgbModal, private formBuilder: FormBuilder) {

    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('OCP_DISABILITY.TITLE');
      this.modalData = this.translate.instant('OCP_DISABILITY.MODAL_DATA');
      this.pageData = this.translate.instant('OCP_DISABILITY');
      this.employeeList = this.translate.instant('OCP_DISABILITY.EMPLOYEE_TYPE');
      this.defaultEmployee = this.employeeList[0].status;
      this.setPageTitle(this.pageTitle, null, true);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.showMobilePopUp('removeClicked');
    this.formValues = this.guideMeService.getMyOcpDisability();
    if (this.formValues && this.formValues.maxAge) {
      this.selectRetirementAge(this.formValues.maxAge);
      this.selectEmployeeType(this.formValues.selectedEmployee, false);
      this.coveragePercent = this.formValues.percentageCoverage;
    }
    this.monthlyIncome = this.guideMeService.getMyIncome();
    if (!this.monthlyIncome.monthlySalary) {
      this.monthlyIncome.monthlySalary = 0;
    }
    this.coverageAmount = (this.monthlyIncome.monthlySalary * this.coveragePercent) / 100;
    if (!this.coverageAmount) {
      this.coverageAmount = 0;
    }
    this.ocpDisabilityForm = this.formBuilder.group({
    });
    // tslint:disable-next-line:max-line-length
    this.subscription = this.navbarService.currentMobileModalEvent.subscribe((event) => {
      if (event === this.pageTitle) {
        this.showMobilePopUp();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.decrementProtectionNeedsIndex();
  }

  selectRetirementAge(age) {
    this.retirementAge = age;
  }

  ngAfterViewInit() {
      this.ocpDisabilitySlider.writeValue(this.coveragePercent);
  }

  onSliderChange(value) {
    this.coveragePercent = value;
    this.coverageAmount = (this.monthlyIncome.monthlySalary * this.coveragePercent) / 100;
    if (!this.coverageAmount) {
      this.coverageAmount = 0;
    }
  }

  selectEmployeeType(status, setSlider) {
    this.defaultEmployee = status;
    this.coverageMax = this.defaultEmployee === 'Salaried Employee' ? 75 : 65;
    if (setSlider) {
      this.setSliderValues(this.coverageMax);
    }
  }

  setSliderValues(value) {
    this.onSliderChange(value);
    this.ocpDisabilitySlider.writeValue(value);
    this.ocpDisabilitySlider.slider.updateOptions({ range: { min: 0, max: value } });
  }
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.navbarService.setPageTitle(title, null, helpIcon);
  }

  showMobilePopUp() {
    const ref = this.modal.open(HelpModalComponent, { centered: true });
    ref.componentInstance.description = this.modalData.description;
    ref.componentInstance.title = this.modalData.title;
    ref.componentInstance.img = assetImgPath + this.modalData.imageName;
    this.navbarService.showMobilePopUp('removeClicked');
  }

  save(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
    } else {

      form.value.coverageAmount = this.coverageAmount;
      form.value.percentageCoverage = this.coveragePercent;
      form.value.maxAge = this.retirementAge;
      form.value.selectedEmployee = this.defaultEmployee;
      this.guideMeService.setMyOcpDisability(form.value);
      return true;
    }
  }

  goToNext(form) {
    if (this.save(form)) {
      this.router.navigate([this.guideMeService.getNextProtectionNeedsPage()]).then(() => {
        this.guideMeService.incrementProtectionNeedsIndex();
      });
    }
  }
}
