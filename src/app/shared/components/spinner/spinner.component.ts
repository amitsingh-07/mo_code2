import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { ANIMATION_DATA } from '../../../../assets/animation/animationData';

declare var require: any;
const bodymovin = require("../../../../assets/scripts/lottie_svg.min.js");

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnInit {

  @Input('showSpinner') showSpinner: boolean = false;

  constructor() {}

  ngOnInit() {
    this.createAnimation();
  }

  createAnimation() {
    const animationData = ANIMATION_DATA.MO_SPINNER;
    bodymovin.loadAnimation({
      container: document.getElementById('mo_spinner'), // Required
      path: '/app/assets/animation/mo_spinner.json', // Required
      renderer: 'canvas', // Required
      loop: true, // Optional
      autoplay: true, // Optional
      animationData: animationData
    })
  }

}
