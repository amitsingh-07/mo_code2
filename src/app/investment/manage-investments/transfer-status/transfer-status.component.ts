import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ManageInvestmentsService } from '../manage-investments.service';
@Component({
  selector: 'app-transfer-status',
  templateUrl: './transfer-status.component.html',
  styleUrls: ['./transfer-status.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransferStatusComponent implements OnInit {
  TransferEntityList
  constructor(
    private router:Router,
    private manageInvestmentsService:ManageInvestmentsService
  ) { }

  ngOnInit(): void {
    this.getTransferEntityList() ;
  }
  goToNext(value){
   this.router.navigate([value]);
  }
  getTransferEntityList() {
    this.manageInvestmentsService.getTransferEntityList().subscribe((data) => {
     this.TransferEntityList = data.objectList;
     console.log(this.TransferEntityList);
      
    });
  }
}
