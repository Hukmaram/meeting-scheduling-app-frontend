import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseUrl = "http://localhost:3000/api/v1";

  constructor(public http:HttpClient) { }
  //component interaction using service
  private userSource = new Subject<string>();
  currentUser$ = this.userSource.asObservable()
  sendUser(selectedUser) {
    this.userSource.next(selectedUser)
  }
//end component interaction using service

  public getCountryName(){
    return this.http.get('./../assets/countries.json');
  }
  public getCountryCode(){
    return this.http.get('./../assets/codes.json');
  }
 public setUserInfoInLocalStorage(data){
   localStorage.setItem('userInfo',JSON.stringify(data))
 }
 public getUserInfoFromLocalStorage(){
   return JSON.parse(localStorage.getItem('userInfo'));
 }
  public signupFunction(data):Observable<any>{
    const params=new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('email',data.email)
    .set('password',data.password)
    .set('admin',data.admin)
    .set('mobile',data.mobile)
    .set('country',data.country)
    return this.http.post(`${this.baseUrl}/users/signup`,params)
  }

  public loginFunction(data):Observable<any>{
    const params=new HttpParams()
    .set('email',data.email)
    .set('password',data.password)
    return this.http.post(`${this.baseUrl}/users/login`,params);
  }

  public forgotPassword(data):Observable<any>{
    const params=new HttpParams()
    .set('email',data.email)
    return this.http.post(`${this.baseUrl}/users/forgotpassword`,params);
  }

  public resetPasswordFunction(data):Observable<any>{
    const params=new HttpParams()
    .set('password',data.password)
    .set('confirmPassword',data.confirmPassword)
    .set('validationToken',data.validationToken)
    return this.http.post(`${this.baseUrl}/users/resetpassword`,params);
  }
  public getUser(authToken):Observable<any>{
    return this.http.get(`${this.baseUrl}/users/view/all?authToken=${authToken}`);
  }

  public getSingleUserDetails(userId):Observable<any>{
    return this.http.get(`${this.baseUrl}/users/view/${userId}`);
  }
  public logout(userId,authToken): Observable<any>{

    const params = new HttpParams()
      .set('authToken',authToken)

    return this.http.post(`${this.baseUrl}/users/${userId}/logout`, params);
  }//end deleteMeeting


  /* Start Meeting Management Functions */

  public addMeeting(data): Observable<any>{

    const params = new HttpParams()
      .set('meetingTopic', data.meetingTopic)
      .set('hostId', data.hostId)
      .set('hostName', data.hostName)
      .set('participantId', data.participantId)
      .set('participantName', data.participantName)
      .set('participantEmail',data.participantEmail)
      .set('meetingStartDate',data.meetingStartDate)
      .set('meetingEndDate',data.meetingEndDate)
      .set('meetingDescription',data.meetingDescription)
      .set('meetingPlace',data.meetingPlace)
      .set('authToken',data.authToken)

    return this.http.post(`${this.baseUrl}/meetings/addMeeting`, params);
  }//end addMeeting
  public getMeetings(userId,authToken):Observable<any>{
  return this.http.get(`${this.baseUrl}/meetings/view/all/meetings/${userId}`)
  }

  public deleteMeeting(meetingId,authToken):Observable<any>{
    const params = new HttpParams()
    .set('authToken',authToken)

  return this.http.post(`${this.baseUrl}/meetings/${meetingId}/delete`, params);
  }
  public getMeetingDetails(meetingId,authToken): Observable<any> {    
    return this.http.get(`${this.baseUrl}/meetings/${meetingId}/details?authToken=${authToken}`);
  }//end getUsers function
  public updateMeeting(data): Observable<any>{

    const params = new HttpParams()
      .set('meetingTopic', data.meetingTopic)
      .set('meetingStartDate',data.meetingStartDate)
      .set('meetingEndDate',data.meetingEndDate)
      .set('meetingDescription',data.meetingDescription)
      .set('meetingPlace',data.meetingPlace)
      .set('authToken',data.authToken)
  
    return this.http.put(`${this.baseUrl}/meetings/${data.meetingId}/updateMeeting`, params);
  }//end addMeeting
  public sentMeetingReminders(userId,authToken): Observable<any>{

    const params = new HttpParams()
      .set('userId', userId)
      .set('authToken', authToken)

    return this.http.post(`${this.baseUrl}/meetings/admin-meetings/sentReminders`, params);
  }//end sending reminder
}
