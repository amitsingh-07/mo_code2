import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  toastMessage: string;
  toastLink: string;
  isToastMessageShown: boolean;
  @Output() linkClicked = new EventEmitter<boolean>();
  constructor(private toastService: ToastService) { }

  ngOnInit() {
    console.log('coming 2', this.toastService);
    this.toastService.toastParamChange.subscribe((param) => {
      if (param) {
        this.showToastMessage(param);
      }
    });
  }
  showToastMessage(msg) {
    this.isToastMessageShown = true;
    this.toastMessage = msg['toastMessage'];
    this.toastLink = msg['toastLink'];
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
    setTimeout(() => {
      this.isToastMessageShown = false;
    }, 3000);
  }
  onToastClick() {
    this.linkClicked.emit();
  }
}
