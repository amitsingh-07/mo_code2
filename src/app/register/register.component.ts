import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public topics:any
  defaultValue:any
  constructor() { }

  ngOnInit() {
    this.topics= ['Angular','React','HTML'];
  this.defaultValue=this.topics[1];
  }

}
