import { Component, OnInit, ElementRef, ViewChild,AfterContentChecked } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit{
 
  public authToken:any;
  public adminId:any;
  public adminName:any;
  public singleUserData:any;
  public selectedUser:any;
  public selectedUserId:any;
  public selectedUserName:any;
  public selectedUserEmail:any;

   
  constructor(public appService:AppService,public toastr:ToastrManager,public router:Router,private _route:ActivatedRoute,public socketService:SocketService) { }
  ngOnInit() {
    let currentUserId=this._route.snapshot.paramMap.get('userId');
    this.getSingleUser(currentUserId);
    this.authToken=Cookie.get('authToken');
    this.adminId=Cookie.get('userId');
    this.adminName=Cookie.get('userName');
    console.log(currentUserId);
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
  meetingTopic:formdata.titleValidation,
  meetingDescription:formdata.descriptionValidation,
  hostId: this.adminId,
  hostName:this.adminName,
  participantId:this.singleUserData.userId,
  participantName:this.singleUserData.firstName+' '+this.singleUserData.lastName,
  participantEmail:this.singleUserData.email,
  meetingStartDate:formdata.startDateValidation.getTime(),
  meetingEndDate:formdata.endDateValidation.getTime(),
  meetingPlace:formdata.locationValidation,
  authToken:this.authToken
  }
 console.log(data);
 this.appService.addMeeting(data).subscribe(
   apiResponse=>{
     if(apiResponse.status==200){
       this.toastr.successToastr("Meeting scheduled successfully");
       console.log(apiResponse);
       let dataForNotify = {
        message: `Hi, ${data.hostName} has Schedule a Meeting With You. Please check your Calendar/Email`,
        userId:data.participantId
      }

      this.notifyUpdatesToUser(dataForNotify);
      setTimeout(() => {
        this.router.navigate(['/admin-dashboard/view-meeting',this.singleUserData.userId])
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
public getSingleUser(currentUserId){
this.appService.getSingleUserDetails(currentUserId).subscribe(apiResponse=>{
  if(apiResponse.status==200){
 this.singleUserData=apiResponse.data;
 
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
