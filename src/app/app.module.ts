import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { UserModule } from './user/user.module';
import { SignupComponent } from './user/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ServerErrorComponent } from './server-error/server-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { AppService } from './app.service';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { NormalUserDashboardComponent } from './dashboard/normal-user-dashboard/normal-user-dashboard.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DashboardModule } from './dashboard/dashboard.module';
import { CreateMeetingComponent } from './dashboard/create-meeting/create-meeting.component';
import { UpdateMeetingComponent } from './dashboard/update-meeting/update-meeting.component';
import { ViewMeetingComponent } from './dashboard/view-meeting/view-meeting.component';


@NgModule({
  declarations: [
    AppComponent,
    ServerErrorComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UserModule,
    DashboardModule,
    RouterModule.forRoot([
      {path:'login',component:LoginComponent,pathMatch:'full'},
      { path:'',redirectTo:'login',pathMatch:'full'},
      { path:'signup',component:SignupComponent,pathMatch:'full'},
      {path:'forgot-password',component:ForgotPasswordComponent,pathMatch:'full'},
      {path:'reset-password/:validationToken',component:ResetPasswordComponent,pathMatch:'full'},
      {path:'admin-dashboard',component:AdminDashboardComponent,pathMatch:'full'},
      {path:'user-dashboard',component:NormalUserDashboardComponent,pathMatch:'full'},
      {path:'admin-dashboard/view-meeting/:userId',component:ViewMeetingComponent,pathMatch:'full'},
      {path:'admin-dashboard/create-meeting/:userId',component:CreateMeetingComponent,pathMatch:'full'},
      {path:'admin-dashboard/update-meeting/:meetingId',component:UpdateMeetingComponent,pathMatch:'full'},
      { path:'serverError',component:ServerErrorComponent,pathMatch:'full'},
      {path:'*',component:NotFoundComponent,pathMatch:'full'},
      {path:'**',component:NotFoundComponent,pathMatch:'full'},
    ]),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
