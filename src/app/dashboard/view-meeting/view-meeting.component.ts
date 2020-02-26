import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {isSameDay,isSameMonth} from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';

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
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit {
   
  public authToken:any;
  public receiverId:any;
  public adminName:any;
  public userId:any;
  public singleUserData:any;
  public userInfo: any;
  public meetings: any = [];
  public events: CalendarEvent[] = [];
  public remindMe: any;
  public reload:any;



  constructor(public toastr:ToastrManager,
    public router:Router,
    private modal: NgbModal,
    public appService:AppService,
    private _route:ActivatedRoute,
    public socketService:SocketService,
    ) { }
   
  ngOnInit() {
    let currentUserId=this._route.snapshot.paramMap.get('userId');
    this.userId=currentUserId;
    this.getSingleUser(currentUserId);
    this.authToken = Cookie.get('authToken');
    this.receiverId = Cookie.get('userId');
    this.adminName = Cookie.get('userName');
    this.getUserAllMeetingFunction()
  }
  @ViewChild('modalContent',{static:false}) modalContent: TemplateRef<any>;
  @ViewChild('modalConfirmation',{static:false}) modalConfirmation: TemplateRef<any>;
  @ViewChild('modalAlert',{static:false}) modalAlert: TemplateRef<any>;

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
    public gotoAdmin(){
      localStorage.setItem('reload', 'yes');
      this.router.navigate(['admin-dashboard']);
    }
   public gotoCreateMeeting(){
    this.router.navigate(['admin-dashboard/create-meeting',this.userId])
   }

   public getUserAllMeetingFunction = () => {//this function will get all the meetings of User. 
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
    
        //  this.toastr.infoToastr("Calendar Updated", "Meetings Found!");
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
    }//end getAllUserMeetings
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
}
