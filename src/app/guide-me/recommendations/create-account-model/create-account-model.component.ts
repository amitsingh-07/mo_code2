import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GuideMeService } from './../../guide-me.service';

@Component({
  selector: 'app-create-account-model',
  templateUrl: './create-account-model.component.html',
  styleUrls: ['./create-account-model.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountModelComponent implements OnInit {
  @Input() data;
  constructor(public activeModal: NgbActiveModal , public guideMeService: GuideMeService ) { }

  ngOnInit() {
  }

}
