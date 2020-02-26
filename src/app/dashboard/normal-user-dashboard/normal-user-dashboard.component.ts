import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {isSameDay,isSameMonth} from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },

  green: {
    primary: '#008000',
    secondary: '#FDF1BA'
  }

  
};
@Component({
  selector: 'app-normal-user-dashboard',
  templateUrl: './normal-user-dashboard.component.html',
  styleUrls: ['./normal-user-dashboard.component.css']
})
export class NormalUserDashboardComponent implements OnInit {
  public authToken: any;
  public userId: any;
  public receiverName: any;
  public userInfo:any;
  public message:any;
  public meetings: any = [];
  public events: CalendarEvent[] = [];
  constructor(public toastr:ToastrManager,public socketService:SocketService,public appService:AppService,private modal:NgbModal,public router:Router) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.receiverName = Cookie.get('userName');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.verifyUserConfirmation()
    this.authErrorFunction(); 
    this.getUpdatesFromAdmin();
    this.getUserAllMeetingFunction();
    setInterval(() => {
      this.meetingReminder();// function to send the reminder to the user
    }, 5000);//will check for every two minutes
  }
 @ViewChild('modalContent',{static:false}) modalContent: TemplateRef<any>;
 @ViewChild('modalConfirmation',{static:false}) modalConfirmation: TemplateRef<any>;
 @ViewChild('modalAlert',{static:false}) modalAlert: TemplateRef<any>;
 @ViewChild('modalReminder',{static:false}) modalReminder: TemplateRef<any>;

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
     this.modalData = { event, action };
     this.modal.open(this.modalContent, { size: 'lg' });
   
 }

 public verifyUserConfirmation: any = () => {
  this.socketService.verifyUser()
    .subscribe(() => {
      this.socketService.setUser(this.authToken);//in reply to verify user emitting set-user event with authToken as parameter.

    });//end subscribe
}//end verifyUserConfirmation

public authErrorFunction: any = () => {
  
  this.socketService.listenAuthError()
    .subscribe((data) => {
      console.log(data)
    });//end subscribe
}//end authErrorFunction


public getUpdatesFromAdmin= () =>{

  this.socketService.getUpdatesFromAdmin(this.userId).subscribe((data) =>{//getting message from admin.
     this.getUserAllMeetingFunction();
    //this.toastr.successToastr("Update From Admin!",data.message);
    this.message=data.message
     this.modal.open(this.modalAlert, { size: 'sm' });
  });
}
public getUserAllMeetingFunction = () => {//this function will get all the meetings of User. 
  if(!this.authToken){
  this.appService.getMeetings(this.userId,this.authToken).subscribe(
    (apiResponse) => {
      if (apiResponse.status == 200) {

        this.meetings = apiResponse.data;
        //console.log(this.meetings)

        for(let meetingEvent of this.meetings) {
            meetingEvent.title =  meetingEvent.meetingTopic;
            meetingEvent.start = new Date(meetingEvent.meetingStartDate);
            meetingEvent.end = new Date(meetingEvent.meetingEndDate);
            meetingEvent.color = colors.green;
            meetingEvent.remindMe = true

          }
        this.events = this.meetings;
        this.refresh.next();
  
        //this.toastr.infoToastr("Calendar Updated", "Meetings Found!");
        //console.log(this.events)

      }
      else {
        this.toastr.errorToastr(apiResponse.message,"Error!");
        this.events = [];
      }
    },
    (error) => {
      if(error.status == 400){
        this.toastr.warningToastr("Calendar Failed to Update", "Either user or Meeting not found");
        this.events = []
      }
      else{
        this.toastr.errorToastr("Some Error Occurred", "Error!");
        this.router.navigate(['/serverError']);

      }
   }
  );
}
else{
  this.toastr.infoToastr('Missing Authorization key', "Please login again");
    this.router.navigate(['/login']);

}
  }//end getAllUserMeetings

  public meetingReminder(): any {
    let currentTime = new Date().getTime();
    //console.log(this.meetings)
    for (let meetingEvent of this.meetings) {

      if (isSameDay(new Date(), meetingEvent.start) && new Date(meetingEvent.start).getTime() - currentTime <= 60000
        && new Date(meetingEvent.start).getTime() > currentTime) {
        if (meetingEvent.remindMe) {

          this.modalData = { action: 'clicked', event: meetingEvent };
          this.modal.open(this.modalReminder, { size: 'sm' });

          break;
        }//end inner if

      }//end if
      else if(currentTime > new Date(meetingEvent.start).getTime() && 
      new Date(currentTime - meetingEvent.start).getTime()  < 10000){
        this.toastr.infoToastr(`Meeting ${meetingEvent.meetingTopic} Started!`, `Gentle Reminder`);
      }  
    }

  }//end of meetingReminder function
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
