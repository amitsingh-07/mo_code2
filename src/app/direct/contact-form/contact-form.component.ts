import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

  close(userAction: any) {    
    this.activeModal.close(userAction)
  }

}
