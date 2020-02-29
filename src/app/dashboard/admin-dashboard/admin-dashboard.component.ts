import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterContentChecked, OnDestroy } from '@angular/core';
import {isSameDay,isSameMonth} from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,CalendarView } from 'angular-calendar';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { Location } from "@angular/common";
const colors: any = {
  green: {
    primary: '#008000',
    secondary: '#FAE3E3'
  }
};
declare var $: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public allUsers:any;
  public adminId:any;
  public adminName:any;
  public userInfo:any;
  public authToken:any;
  public onlineUserList: any[];
  public allUsersData: any[];
  public userId:any;
  public userName:any;
  public receiverId:any;
  public receiverName:any;
  public gentleReminder: Boolean = true;
  public meetings: any = [];
  public events: CalendarEvent[] = [];

  constructor(
    public toastr:ToastrManager,
    public router:Router,
    private modal: NgbModal,
    public appService:AppService,
    public socketService:SocketService,
    public location: Location
    ) { }

  ngOnInit() {
    this.authToken=Cookie.get('authToken');
    this.adminId=Cookie.get('userId');
    this.adminName=Cookie.get('userName');
    this.userInfo=this.appService.getUserInfoFromLocalStorage();
    this.verifyUserConfirmation()
      this.getOnlineUserList()
      this.getAllUsers();
   // this.authErrorFunction()  
    this.getAdminAllMeetings();
   
    setInterval(() => {
      this.meetingReminder();// function to send the reminder to the user
    }, 5000); //will check for every 5 seconds

    if(localStorage.getItem('reload')){
      console.log("RELOADED");
      location.reload();
      localStorage.removeItem('reload');
    }
  }


  @ViewChild('modalContent',{static:false}) modalContent: TemplateRef<any>;
  @ViewChild('modalConfirmation',{static:false}) modalConfirmation: TemplateRef<any>;
  @ViewChild('modalAlert',{static:false}) modalAlert: TemplateRef<any>;
  @ViewChild('closeModal',{static:false}) closeModal:ElementRef;

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-pencil-alt"></i>       ',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fas fa-trash-alt"></i>        ',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

 
  /* Calendar Events */

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      //console.log('Day CLicked')
      this.viewDate = date;
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        //this.activeDayIsOpen = true;
        this.view = 'day'
      }
    }
  }


  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: any): void {
    //console.log(event)

    if (action === 'Edited') {
      this.router.navigate([`/admin-dashboard/update-meeting/${event.meetingId}`]);
    }

    else if (action === 'Deleted') {
      console.log(action === 'Deleted')
      // $(document).ready(function(){
      // $('#myModal').click();
      // })
      this.modalData = { event, action };
      this.modal.open(this.modalConfirmation, { size: 'sm' });

    }
    else {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }

  deleteEvent(event: any): void {
    //console.log("Deleted...")

   this.deleteMeetingFunction(event);

    this.events = this.events.filter(iEvent => iEvent !== event);
    this.refresh.next();
    this.activeDayIsOpen = false;
  }

/* End Calendar Events */

public getAllUsers(){
  if(this.authToken!=null){
    this.allUsersData=[];
    this.appService.getUser(this.authToken).subscribe(apiResponse=>{
      if(apiResponse.status==200){
        this.allUsersData=apiResponse.data;
        //this.toastr.infoToastr("Updated", "All users listed");
      }
      else{
        this.toastr.errorToastr(apiResponse.message, "User Update");
      }
    },
    error=>{
      this.toastr.errorToastr('Server error occured', "Error!");
      this.router.navigate(['/serverError']);
    }
    )
  }
  else{
    this.toastr.infoToastr('Missing Authorization key', "Please login again");
      this.router.navigate(['/login']);
  }
}
public verifyUserConfirmation=()=>{
  this.socketService.verifyUser().subscribe(()=>{
    this.socketService.setUser(this.authToken);
  })
}
public authErrorFunction: any = () => {

  this.socketService.listenAuthError()
    .subscribe((data) => {
      this.toastr.infoToastr("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);

    });//end subscribe
}//end authErrorFunction
public getOnlineUserList: any = () => {
  this.socketService.onlineUserList()
    .subscribe((data) => {
      this.onlineUserList = []
      for (let i=0; i<data.length; i+=1) {
        this.onlineUserList.push(data[i].userId);
       }
      console.log(this.onlineUserList);

      for (let user of this.allUsersData) {
        if (this.onlineUserList.includes(user.userId)) {
          user.status = "online"
         // this.allUsers.status="online";
        } else {
          user.status = "offline"
         // this.allUsers.status="offline";
        }

      }
     // console.log(this.allUsersData)

    });//end subscribe
}//end getOnlineUserList

//routeTo User Page
public routeToUserPage(userId){

  this.router.navigate(['admin-dashboard/view-meeting',userId])


}
public gotoAdminDashboard(){
  this.router.navigate(['admin-dashboard']);
}

public getAdminAllMeetings(){
  if(this.adminId!=null){
  this.appService.getMeetings(this.adminId,this.authToken).subscribe(apiResponse=>{
    if (apiResponse.status == 200) {

      this.meetings = apiResponse.data;
      //console.log(this.meetings)
      for (let meetingEvent of this.meetings) {
        meetingEvent.title = meetingEvent.meetingTopic;
        meetingEvent.start = new Date(meetingEvent.meetingStartDate);
        meetingEvent.end = new Date(meetingEvent.meetingEndDate);
        meetingEvent.color = colors.green;
        meetingEvent.actions = this.actions
        meetingEvent.remindMe = true
        
      }
      this.events = this.meetings;
      //console.log(this.events)
      this.refresh.next();

      //this.toastr.infoToastr("Calendar Updated", `Meetings Found!`);
      //console.log(this.events)

    }
    else{
      this.toastr.errorToastr(apiResponse.message, "Error!");
      this.events = [];
    }
  },
  (error) => {
    if (error.status == 400) {
      this.toastr.warningToastr("Calendar Failed to Update", "Either user or Meeting not found");
      this.events = []
    }
    else {
      this.toastr.errorToastr("Some Error Occurred", "Error!");
      this.router.navigate(['/serverError']);

    }
  }//end error
  )
}
}

public deleteMeetingFunction(meeting): any {
  this.appService.deleteMeeting(meeting.meetingId, this.authToken)
    .subscribe((apiResponse) => {

      if (apiResponse.status == 200) {
        this.toastr.successToastr("Deleted the Meeting", "Successfull!");

        let dataForNotify = {
          message: `Hi, ${this.adminName} has canceled the meeting - ${meeting.meetingTopic}. Please Check your Calendar/Email`,
          userId: meeting.participantId
        }

        this.notifyUpdatesToUser(dataForNotify);

      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
      (error) => {

        if (error.status == 404) {
          this.toastr.warningToastr("Delete Meeting Failed", "Meeting Not Found!");
        }
        else {
          this.toastr.errorToastr("Some Error Occurred", "Error!");
          this.router.navigate(['/serverError']);

        }

      });//end calling deletemeeting

}//end deletemeeting
public notifyUpdatesToUser: any = (data) => {
  //data will be object with message and userId(recieverId)
  this.socketService.notifyUpdates(data);
}//end notifyUpdatesToUser


public meetingReminder(): any {
  let currentTime = new Date().getTime();
  //console.log(this.meetings)
  for (let meetingEvent of this.meetings) {

    if (isSameDay(new Date(), meetingEvent.start) && new Date(meetingEvent.start).getTime() - currentTime <= 60000
      && new Date(meetingEvent.start).getTime() > currentTime) {
      if (meetingEvent.remindMe && this.gentleReminder) {

        this.modalData = { action: 'clicked', event: meetingEvent };
        this.modal.open(this.modalAlert, { size: 'sm' });
        this.gentleReminder = false
        break;
      }//end inner if

    }//end if
    else if(currentTime > new Date(meetingEvent.start).getTime() && 
    new Date(currentTime - meetingEvent.start).getTime()  < 10000){
      this.toastr.infoToastr(`Meeting ${meetingEvent.meetingTopic} Started!`, `Gentle Reminder`);
    }  
  }

}//end of meetingReminder function
public sentMeetingRemindersonEmailFunction = () => {//this function will get all the normal users from database. 

  if (this.authToken != null && this.adminId != null) {
    this.appService.sentMeetingReminders(this.adminId,this.authToken).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        this.toastr.successToastr("Meeting Reminders sent", "Update");

      }
      else {
        this.toastr.errorToastr(apiResponse.message, "Error!");
      }
    },
      (error) => {
        this.toastr.errorToastr('Server error occured', "Error!");
        this.router.navigate(['/serverError']);

      }//end error
    );//end sentreminders

  }//end if
  else {
    this.toastr.infoToastr('Missing Authorization key', "Please login again");
    this.router.navigate(['/login']);

  }//end else

}//end sentRemindersFunction
public logoutFunction = (userId) => {
  this.appService.logout(userId, this.authToken).subscribe(
    (apiResponse) => {
      if (apiResponse.status === 200) {
        
        Cookie.delete('authToken');//delete all the cookies
        Cookie.delete('userId');
        Cookie.delete('userName');
        
        localStorage.clear();
        
        this.socketService.disconnectedSocket();//calling the method which emits the disconnect event.
        this.socketService.exitSocket();//this method will disconnect the socket from frontend and close the connection with the server.


        setTimeout(() => {
          this.router.navigate(['/login']);//redirects the user to login page.
        }, 1000);//redirecting to Dashboard page


      } else {
        this.toastr.errorToastr(apiResponse.message, "Error!")
        this.router.navigate(['/serverError']);//in case of error redirects to error page.
      } // end condition
    },
    (err) => {
      if (err.status == 404) {
        this.toastr.warningToastr("Logout Failed", "Already Logged Out or Invalid User");
      }
      else {
        this.toastr.errorToastr("Some Error Occurred", "Error!");
        this.router.navigate(['/serverError']);

      }
    });

}//end logout  

}
