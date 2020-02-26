import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public countriesCodeName:any=[];
  public countriesCodeNumber:any=[];
  public allCountries:any;
  public myCountryName:any;
  public myCountry:any;
  public myCountryCode:any;
  public roles:any=[{description:'admin',value:'yes'},{description:'normal',value:'no'}];
  constructor(public appService:AppService,public toastr:ToastrManager,public router:Router) { }


  ngOnInit() {
    this.getCountryName();
    this.getCountryCode();
   // this.callWhenCountryChange()

  }

  public getCountryName(){
    this.appService.getCountryName().subscribe(reponse=>{
      for(let i in reponse){
      let singleCountryAndCode={
        code:i,
        name:reponse[i]
      }
      this.countriesCodeName.push(singleCountryAndCode)
    }
    console.log(this.countriesCodeName)
    this.allCountries=reponse;
    })
  }
  public getCountryCode(){
    this.appService.getCountryCode().subscribe(data=>{
        this.countriesCodeNumber=data;
      console.log(this.countriesCodeNumber);
    })
  }

  public callWhenCountryChange(){
  this.myCountryCode=this.countriesCodeNumber[this.countryValidation.value];
  //console.log("MY COUNTRY CODE"+this.myCountryCode)
   this.myCountryName=this.allCountries[this.countryValidation.value];
  }

//form validator

get firstNameValidation(){
  return this.signupForm.get('firstNameValidation');
}
get lastNameValidation(){
  return this.signupForm.get('lastNameValidation');
}
get emailValidation(){
  return this.signupForm.get('emailValidation');
}

get passwordValidation(){
  return this.signupForm.get('passwordValidation');
}

get mobileValidation(){
  return this.signupForm.get('mobileValidation');
}
get countryValidation(){
  return this.signupForm.get('countryValidation');
}
get userTypeValidation(){
  return this.signupForm.get('userTypeValidation');
}


signupForm=new FormGroup({
  firstNameValidation:new FormControl('',[
    Validators.required,
    Validators.minLength(4)
  ]),
  lastNameValidation:new FormControl('',[
    Validators.required,
    Validators.minLength(4)
  ]),
  emailValidation:new FormControl('',[
    Validators.required,
    Validators.email
  ]),
  passwordValidation:new FormControl('',[
    Validators.required,
    Validators.minLength(8)
  ]),
  mobileValidation:new FormControl('',[
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/)
  ]),
  countryValidation:new FormControl('',[
    Validators.required
  ]),
  userTypeValidation:new FormControl()

})

onSubmit(){
  //console.log(this.signupForm.value);
  let formdata=this.signupForm.value;
  let data={
  firstName:formdata.firstNameValidation,
  lastName:formdata.lastNameValidation,
  email:formdata.emailValidation,
  password:formdata.passwordValidation,
  admin:formdata.userTypeValidation,
  mobile:`${this.myCountryCode}${formdata.mobileValidation}`,
  country:this.myCountryName
  }
  if(data.admin==null){
    data.admin=false;
  }
 console.log(data);
 this.appService.signupFunction(data).subscribe(
   apiResponse=>{
     if(apiResponse.status==200){
       this.toastr.successToastr("Account created successfully");
       this.router.navigate(['/login'])
     }
     else{
       this.toastr.errorToastr(apiResponse.message);
     }

   },
   error=>{
     this.toastr.errorToastr("Some error occured"+error.message);
     console.log(error)
     this.router.navigate(['/serverError']);

   }
 )
}

}
