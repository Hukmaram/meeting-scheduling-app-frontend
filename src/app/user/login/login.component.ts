import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   private reload:any;
  constructor(public appService:AppService,public toastr:ToastrManager,public router:Router) { }

  ngOnInit() {
  }
  get emailValidation(){
    return this.loginForm.get('emailValidation');
  }
  
  get passwordValidation(){
    return this.loginForm.get('passwordValidation');
  }

  loginForm=new FormGroup({
    emailValidation:new FormControl('',[
      Validators.required,
      Validators.email
    ]),
    passwordValidation:new FormControl('',[
      Validators.required
    ]),
  })
  onSubmit(){
    //console.log(this.signupForm.value);
    let formdata=this.loginForm.value;
    let data={
    email:formdata.emailValidation,
    password:formdata.passwordValidation
    }
   this.appService.loginFunction(data).subscribe(
     apiResponse=>{
       if(apiResponse.status==200){
         Cookie.set('authToken',apiResponse.data.authToken)
         Cookie.set('userId',apiResponse.data.userDetails.userId)
         Cookie.set('userName',`${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`)
        this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
        if(apiResponse.data.userDetails.admin=='true'){
         this.router.navigate(['/admin-dashboard'])
        }
        else{
          this.router.navigate(['/user-dashboard'])
        }
       }
       else{
         this.toastr.errorToastr(apiResponse.message);
       }
     },
     error=>{
      if(error.status == 404){
        this.toastr.warningToastr("Login Failed", "User Not Found!");
      }
      else if(error.status == 400){
        this.toastr.warningToastr("Login Failed", "Wrong Password");
      }
      else{
        this.toastr.errorToastr("Some Error Occurred", "Error!");
        this.router.navigate(['/serverError']);

      }

     }
   )
  }

}
