import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(private translate: TranslateService, private willWritingService: WillWritingService, private router: Router) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

}
