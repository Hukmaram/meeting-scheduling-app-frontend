#  Meeting Planning System
## Project Description
This project should be a ready to deploy meetings scheduling system. It must have all
the features mentioned below and it must be deployed on a server before
submission.There should be two separate parts of the application. A Frontend
developed and deployed using the technologies mentioned below and a REST API (with
realtime functionalities) created using the technologies mentioned below.
Frontend Technologies allowed - HTML5, CSS3, JS, Bootstrap and Angular
Backend Technologies allowed - NodeJS, ExpressJS and Socket.IO
Database Allowed - MongoDB and Redis
## Features
 ### User management System
* Signup - User should be able to sign up on the platform providing all
details like FirstName, LastName, Email and Mobile number. Country
code for mobile number (like 91 for India) should also be stored. You may
find the country code data on these links
(http://country.io/phone.json,http://country.io/names.json)
* Login - user should be able to login using the credentials provided at
signup.
* Forgot password - User should be able to recover password using a link or
code on email. You may use Nodemailer to send emails. (Please use a
dummy gmail account, not your real account).
### User Authorization system
* User can be of two roles, normal and admin. Admin should be identified
with a username ending with "admin", like "alex-admin" is an admin, since
it ends with "admin".
### User Slots management system (Flow for normal User) -
* Upon login, normal User should be taken to a dashboard showing his
current months', planned meetings, in the form of a calendar. Current
day-cell should be selected by default.
* User should be able to only view his meeting slots and he should not be
able to make any changes
* Hint - you may use calendar modules of Angular to design the Interface. One
such module which you can use for calendar UI is Angular-Calendar.
### User Slots management system (Flow for Admin User)-
* Upon login, admin User should be taken to a dashboard, showing all
normal users in a list format
* Upon clicking on any user, admin should be taken to user's current
calendar, with current date selected, by default.
* Admin should be able to add/delete/update meetings on any day, by
clicking on a appropriate day-cell/timeline.
* These details should be stored in database for every user.
### User Alerts management system-
* Normal User should also be notified in real time, though an alert if he is
online, and email (irrespective of whether he is online or offline), when
1. A meeting is created by admin
2. A meeting is changed by admin
3. 1 minute before meeting, with an option to snooze or dismiss. If
snoozed, alert should come again in 5 seconds, if snoozed again, it
should re-appear in next 5 seconds and so on. Once dismissed,
alert should no longer appear.
### Planner Views-
*  Similar to Google or outlook calendars.
* The view must follow the following guidelines -
1. Planner should show only current year, past and future years to be
ignored.
2. User should be able to change months, through an arrow button(or
prev/next button), each month should show all the dates in tabular
format, like in actual calendar.
3. Day Cells should be filled, if any meeting is kept, with a some
design. There should also be a design for overlapping meetings.
4. Upon click the day's cell, a view should pop, showing all meetings,
along a 24 hr timeline, with the slots covering the exact duration of
each meeting.
5. Upon clicking on a meeting, its details should pop up in another
view
### Admin Flow-
* For admin, a create button should be there in calendar view, to
create a meeting.
* Upon clicking on create button, details view should open.
* Once created, it should appear on the calendar view.
* Upon clicking on an already created meeting, same details view
should open.
* Details view should be a form
* Admin should be able to make changes in meeting details form,
and submit.
* Admin should be able to delete a meeting as well, with another
button
* Meeting details, should cover when, where and purpose. Also, by
default username of the admin, who kept the meeting, should also
show in non-editable format.
### Error Handling
*  You have to handle each major error response
(like 404 or 500) with a different page. Also, all kind of errors, exceptions and
messages should be handled properly on frontend. The user should be aware all
the time on frontend about what is happening in the system.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Note : You can skip this steps if you have Node ,npm and angularCLI installed on your system.

* To start with this, install node and npm
* Install git
* Use npm to install Angular CLI . Exceute this command `npm install -g @angular/cli`
### Installing/ Running locally
1.Create a folder named as todo-app-frontend at any local drive

2. change directory to todo-app-frontend
`cd meeting-scheduling--app`
3. Fetch the source code from my github library
`git init`
`git remote add origin https://github.com/Hukmaram/meeting-scheduling-app-frontend.git`
`git pull origin master`
4. Install all the modules required to run the given application with following command
`npm install`
5. Run the application by using following command
`ng serve --open`
6. Navigate to http://localhost:4200/ via browser . You will see the application is running.

 * [Live Demo](http://mymeet.co/) - Application is up and running here
 * [api.mymeet.co](api.mymeet.co) - REST API
 
## Built With
* Angular - The web framework used for Frontend Design
* NPM - Most of the modules are used
* nodemailer - NPM module to send the mails
* apiDoc - NPM module to create the apiDoc
* MongoDB - Database
* Git - Version control

## Author
* Hukmaram Bishnoi

## License
This project is licensed under the MIT License

## Repository for Backend
[https://github.com/Hukmaram/meeting-scheduling-app-backend.git](https://github.com/Hukmaram/meeting-scheduling-app-backend.git)
