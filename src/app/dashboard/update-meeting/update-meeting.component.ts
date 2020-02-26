import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-update-meeting',
  templateUrl: './update-meeting.component.html',
  styleUrls: ['./update-meeting.component.css']
})
export class UpdateMeetingComponent implements OnInit {

  public authToken:any;
  public adminId:any;
  public adminName:any;
  public meetingDetails:any;
  public singleUserData:any;

  constructor(public appService:AppService,public toastr:ToastrManager,public router:Router,private _route:ActivatedRoute,public socketService:SocketService) { 
  }

  ngOnInit() {
    let meetingId=this._route.snapshot.paramMap.get('meetingId');
    this.authToken=Cookie.get('authToken');
    this.adminId=Cookie.get('userId');
    this.adminName=Cookie.get('userName');
    this.getMeetingDetailsFunction(meetingId, this.authToken) ;
    
  }

//form validator
get titleValidation(){
  return this.meetingForm.get('titleValidation');
}
get descriptionValidation(){
  return this.meetingForm.get('descriptionValidation');
}
 get startDateValidation(){
   return this.meetingForm.get('startDateValidation');
 }
 get endDateValidation(){
  return this.meetingForm.get('endDateValidation');
}
get locationValidation(){
  return this.meetingForm.get('locationValidation');
}


meetingForm=new FormGroup({
  titleValidation:new FormControl('',[
    Validators.required,
    Validators.minLength(4)
  ]),
  descriptionValidation:new FormControl('',[
    Validators.required,
    Validators.minLength(4)
  ]),
  locationValidation:new FormControl('',[
    Validators.required,
    Validators.minLength(4)
  ]),
  startDateValidation:new FormControl('',[
    Validators.required
  ]),
  endDateValidation:new FormControl('',[
    Validators.required
  ]),
})

onSubmit(){
  //console.log(this.signupForm.value);
  let formdata=this.meetingForm.value;
  let data={
  meetingId: this.meetingDetails.meetingId,
  meetingTopic:formdata.titleValidation,
  meetingDescription:formdata.descriptionValidation,
  meetingStartDate:formdata.startDateValidation.getTime(),
  meetingEndDate:formdata.endDateValidation.getTime(),
  meetingPlace:formdata.locationValidation,
  authToken:this.authToken
  }
 console.log(data);
 this.appService.updateMeeting(data).subscribe(
   apiResponse=>{
     if(apiResponse.status==200){
       this.toastr.successToastr("Meeting updated successfully");
       console.log(apiResponse);
        let dataForNotify = {
         message: `Hi, ${this.meetingDetails.hostName} has Rescheduled Meeting With You. Please check your Calendar/Email`,
         userId:this.meetingDetails.participantId
       }

     this.notifyUpdatesToUser(dataForNotify);
      setTimeout(() => {
        this.router.navigate(['/admin-dashboard/view-meeting',this.meetingDetails.participantId])
      }, 1000);//redirecting to admin dashboard page
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
public getMeetingDetailsFunction(meetingId,authToken){
  this.appService.getMeetingDetails(meetingId,authToken).subscribe(apiResponse=>{
    if(apiResponse.status==200){
   this.meetingDetails=apiResponse.data;
   this.meetingDetails.meetingStartDate=new Date(this.meetingDetails.meetingStartDate);
   this.meetingDetails.meetingEndDate=new Date(this.meetingDetails.meetingEndDate)
   
    }
    else{
      this.toastr.errorToastr(apiResponse.message)
    }
   
  },
  error=>{
    this.toastr.errorToastr("some error ocured");
  }
  )
  }
  public notifyUpdatesToUser: any = (data) => {
    //data will be object with message and userId(recieverId)
    this.socketService.notifyUpdates(data);
  }//end notifyUpdatesToUser
}
