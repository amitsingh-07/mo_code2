import { Component, OnInit,ViewEncapsulation,HostListener, AfterContentInit, AfterViewInit} from '@angular/core';
import 'rxjs/add/observable/timer';
import { PortfolioService } from './../portfolio.service';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { Router } from '@angular/router';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { PORTFOLIO_ROUTES,PORTFOLIO_ROUTE_PATHS } from '../portfolio-routes.constants';


@Component({
 
  selector: 'app-portfolio-recommendation',
  templateUrl: './portfolio-recommendation.component.html',
  styleUrls: ['./portfolio-recommendation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioRecommendationComponent implements OnInit, AfterViewInit {
  animateStaticModal = false;
  hideStaticModal = false;
  pageTitle: string;
 
  
  helpDate:any;
  constructor(
    private router: Router,
     public headerService: HeaderService,
    private translate: TranslateService, 
    //private guideMeCalculateService: GuideMeCalculateService, 
    public modal: NgbModal,
  private portfolioService:PortfolioService) {
    this.translate.use('en');
    let self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.TITLE');
     
      self.helpDate = this.translate.instant('PORTFOLIO_RECOMMENDATION.helpDate');
      this.setPageTitle(this.pageTitle, null, false);
    });
  }
 

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
  }
  ngAfterViewInit() {
  
    if (this.portfolioService.getPortfolioRecommendationModalCounter() === 0 ) {
      this.portfolioService.setPortfolioRecommendationModalCounter(1);
      setInterval(() => {
        this.animateStaticModal = true;
      }, 2000);

      setInterval(() => {
        this.hideStaticModal = true;
      }, 3000);
    } else {
      this.hideStaticModal = true;
    }
  }
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }
  showHelpModal(){
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.helpDate.modalTitle;
    ref.componentInstance.errorMessage = this.helpDate.modalMessage; 
    return false;
  }
  showWhatTheRisk(){
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);

  }
  showWhatFubdDetails(){
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);
  }

}

