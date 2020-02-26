import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(public appService:AppService,public toastr:ToastrManager,public router:Router) { }

  ngOnInit() {
  }
  get emailValidation(){
    return this.forgotPasswordForm.get('emailValidation');
  }

  forgotPasswordForm=new FormGroup({
    emailValidation:new FormControl('',[
      Validators.required,
      Validators.email
    ])
  })
  onSubmit(){
    let data={
      email:this.forgotPasswordForm.value.emailValidation
    }
    this.appService.forgotPassword(data).subscribe(
      apiResponse=>{
        if(apiResponse.status==200){
        this.toastr.successToastr("Link to change password sent to Email");
        }
        else{
          this.toastr.errorToastr(apiResponse.message);
        }
      },
      error=>{
        if(error.status==404){
          this.toastr.errorToastr("Email not found","Error");
        }
        else{
          this.toastr.errorToastr("Some Error Occured","Error");
          this.router.navigate(['/serverError'])
        }
      }
    )
  }
}
