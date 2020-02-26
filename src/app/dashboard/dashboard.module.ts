import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NormalUserDashboardComponent } from './normal-user-dashboard/normal-user-dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ng6-toastr-notifications';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { UpdateMeetingComponent } from './update-meeting/update-meeting.component';
import { ViewMeetingComponent } from './view-meeting/view-meeting.component';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  declarations: [NormalUserDashboardComponent, AdminDashboardComponent, CreateMeetingComponent, UpdateMeetingComponent, ViewMeetingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FormsModule,
    NgbModalModule,
    ToastrModule,
    RouterModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ],
  providers:[AdminDashboardComponent]
})
export class DashboardModule { }
