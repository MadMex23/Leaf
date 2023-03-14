import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  usersURL: string = 'http://localhost:3030/users';
  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
    };
  }

  private handlerException(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('Front Error: ' + error.error.message);
    } else {
      console.log('Back Error: ' + error.error.message + error.error.status);
    }
    return throwError('Comunication Error');
  }

  // loginUser(user: User): Observable<User> {
  //   return this.http
  //     .post<User>(this.usersURL, user, this.getHttpOptions())
  //     .pipe(catchError(this.handlerException));
  // }

  loginUser(user: User): Observable<User> {
    return this.http
      .get<User>(this.usersURL + '?email=' + user.email)
      .pipe(catchError(this.handlerException));
  }

  signupUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.usersURL, user, this.getHttpOptions())
      .pipe(catchError(this.handlerException));
  }
}
