import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ManageInvestmentsService } from '../manage-investments.service';
import { TranslateService } from '@ngx-translate/core';
import { NavbarService } from '../../../shared/navbar/navbar.service';
@Component({
  selector: 'app-transfer-status',
  templateUrl: './transfer-status.component.html',
  styleUrls: ['./transfer-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransferStatusComponent implements OnInit {
  TransferEntityList :any; 
  formValues: any;  
  constructor(
    private router:Router,
    private manageInvestmentsService:ManageInvestmentsService,
    public readonly translate: TranslateService,
    public navbarService: NavbarService,
  ) { this.translate.use('en');}

  ngOnInit(): void {
    document.body.style.backgroundColor = "Lochinvar";
    this.navbarService.setNavbarVisibility(false);
    this.navbarService.setNavbarMode(10);
    this.navbarService.setNavbarMobileVisibility(false);
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.getTransferEntityList() ;
  }
  goToNext(value){
   this.router.navigate([value]);
  }
  ngOnDestroy() {
   // document.body.classList.remove('body');
    document.body.style.backgroundColor = "Lochinvar";
  }
  getTransferEntityList() {
    this.manageInvestmentsService.getTransferEntityList(this.formValues.selectedCustomerPortfolioId).subscribe((data) => {
     this.TransferEntityList = data.objectList;
     console.log(this.TransferEntityList);
    });
  }
}
