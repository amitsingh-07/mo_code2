import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-intro-screen',
  templateUrl: './intro-screen.component.html',
  styleUrls: ['./intro-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntroScreenComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() img: string;
  @Input() description2: string;
  @Input() tab: string;

  constructor() {}

  ngOnInit() {}
}
