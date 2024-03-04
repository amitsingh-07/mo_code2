import { ResponseMessage } from './../../direct/direct-model';
import { ApiService } from './../../shared/http/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService2 } from '../data-service/data.service';
import { Router } from '@angular/router';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { AuthenticationService } from 'src/app/shared/http/auth/authentication.service';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})
export class Login2Component implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private apicalls: ApiService2,
    private router: Router,
    private authservice: AuthenticationService
    ){}

  emailpattern = '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/';
  passwordptn = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$';
  profileValue: FormGroup = new FormGroup({
    username : new FormControl('', [Validators.required, Validators.email, Validators.pattern(this.emailpattern)]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordptn)]),
  })

  ngOnInit() {
  }

  get userNameError(){
    let usErrorMsg = '';
    let userNameControls = this.profileValue.get('username')
    if(userNameControls?.touched){
      if(userNameControls?.errors?.['required']){
        usErrorMsg = 'Enter the Field';
      }else if(userNameControls?.errors?.['email']){
        usErrorMsg = 'Enter the Valid Email';
      }
    }
    return usErrorMsg;
  }

  get passwordError(){
    let pwdErrormsg = '';
    let pwdControls = this.profileValue.get('password')
    if(pwdControls?.touched){
      if(pwdControls?.errors?.['required']){
        pwdErrormsg = 'Enter this Field';
      }
      else if(pwdControls?.errors?.['pattern']){
        pwdErrormsg = 'Enter the valid Passsword';
      }
    }
    return pwdErrormsg;
  }
  onSubmit(form: any){
    console.log(form.value);
    this.apicalls.getLoginInfo().subscribe( (loginInfo: any) =>{
      console.log(loginInfo.responseMessage.responseCode);
      console.log(loginInfo.objectList[0]);
      this.authservice.login2();
      if(loginInfo.responseMessage && loginInfo.responseMessage.responseCode >= 6000){
        this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_2FA])
      }
    })
  }

}
