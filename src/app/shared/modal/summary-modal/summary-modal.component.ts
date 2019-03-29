import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../../config/config.service';

@Component({
  selector: 'app-summary-modal',
  templateUrl: './summary-modal.component.html',
  styleUrls: ['./summary-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryModalComponent implements OnInit {
  @Input() summaryModalDetails: any;
  calculateCashDesc = true;
  constructor(public activeModal: NgbActiveModal, private router: Router, private translate: TranslateService,
    private configService: ConfigService) { }

  ngOnInit() {
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }

  toggleCalculatePop() {
    this.calculateCashDesc = !this.calculateCashDesc;
  }
  goNextPage() {
    this.router.navigate([this.summaryModalDetails.nextPageURL]);
  }
}
