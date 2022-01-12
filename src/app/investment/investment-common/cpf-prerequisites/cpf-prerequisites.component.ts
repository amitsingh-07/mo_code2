import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';

@Component({
  selector: 'app-cpf-prerequisites',
  templateUrl: './cpf-prerequisites.component.html',
  styleUrls: ['./cpf-prerequisites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CpfPrerequisitesComponent implements OnInit {

  pageTitle: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private modal: NgbModal
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CPF_PREREQUISITES.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit(): void {
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

}
