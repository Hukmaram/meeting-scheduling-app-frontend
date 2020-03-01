import { Injectable } from '@angular/core';

//Added for Http and Observables
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';
import { th } from 'date-fns/locale';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = "http://api.mymeet.co";
  public socket;
  
  constructor(private http: HttpClient) {
    this.socket=io(this.baseUrl,{forceNew:true})
   }
   //listening
   public verifyUser=()=>{
     return Observable.create((observer)=>{
       this.socket.on('verifyUser',(data)=>{
         observer.next(data);
       })
     })
   }
   public onlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (userList) => {
        observer.next(userList);
      });//end On method
    });//end observable

  }//end onlineUserList
   public listenAuthError = () => {
    return Observable.create((observer) => {
      this.socket.on('auth-error', (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end listenAuthError
  public disconnect = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });//end On method
    });//end observable

  }//end disconnect
  public getUpdatesFromAdmin = (userId) => {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } // end getUpdatesFromAdmin
  
  //  //emitting
   public setUser=(authToken)=>{
     this.socket.emit('set-user',authToken)
   }

   public notifyUpdates = (data) => {
    this.socket.emit('notify-updates', data);
  }


   public exitSocket = () =>{
    this.socket.disconnect();
  }// end exit socket

  public disconnectedSocket = () => {

      this.socket.emit("disconnect", "");//end Socket

  }//end disconnectedSocket
  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
