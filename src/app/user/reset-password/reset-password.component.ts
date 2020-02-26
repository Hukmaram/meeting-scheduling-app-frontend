import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public validationToken:any;
  constructor(public appService:AppService,public router:Router,public toastr:ToastrManager,public route: ActivatedRoute) { }

  ngOnInit() {
    this.validationToken = this.route.snapshot.paramMap.get('validationToken');
  }
  get passwordValidation(){
    return this.resetForm.get('passwordValidation');
  }
  get confirmPasswordValidation(){
    return this.resetForm.get('confirmPasswordValidation');
  }

  resetForm=new FormGroup({
    confirmPasswordValidation:new FormControl('',[
      Validators.required
    ]),
    passwordValidation:new FormControl('',[
      Validators.required
    ]),
  })
  onSubmit(){
    //console.log(this.signupForm.value);
    let formdata=this.resetForm.value;
    let data={
    confirmPassword:formdata.confirmPasswordValidation,
    password:formdata.passwordValidation,
    validationToken:this.validationToken
    }
   this.appService.resetPasswordFunction(data).subscribe(
     apiResponse=>{
       if(apiResponse.status==200){
        this.toastr.successToastr("Password Reset Successfully")
         this.router.navigate(['/login'])
       }
       else{
         this.toastr.errorToastr(apiResponse.message);
       }
     },
     error=>{
       
         this.toastr.errorToastr("Some error occured");
         console.log(error.message);
         this.router.navigate(['/serverError']);

     }
   )
  }



}
