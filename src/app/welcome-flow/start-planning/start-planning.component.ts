import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-start-planning',
  templateUrl: './start-planning.component.html',
  styleUrls: ['./start-planning.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StartPlanningComponent implements OnInit {

  constructor(public readonly translate: TranslateService) { 
    this.translate.use('en');
  }

  ngOnInit(): void {
  }

}
