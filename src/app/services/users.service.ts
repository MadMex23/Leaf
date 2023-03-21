import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import Swal from 'sweetalert2';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  _usersURL: string = 'http://localhost:8080/users';
  private _accountsList: Array<Account> = new Array();

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
    };
  }

  private handlerException(error: HttpErrorResponse) {
    let toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      color: '#232931',
      iconColor: '#232931',
      background: '#ff5c5c',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: false,
    });
    if (error.error instanceof ErrorEvent) {
      console.log('Front Error: ' + error.status + ' - ' + error.error.message);
      return toast.fire({
        icon: 'error',
        title: error.error.message,
      });
    } else {
      console.log('Back Error: ' + error.status + ' - ' + error.error.message);
      return toast.fire({
        icon: 'error',
        title: error.error.message,
      });
    }
  }

  loginUser(user: User): Observable<any> {
    return this.http
      .post<User>(this._usersURL + '/login', user, this.getHttpOptions())
      .pipe(catchError(this.handlerException));
  }

  signupUser(user: User): Observable<any> {
    return this.http
      .post<User>(this._usersURL + '/signup', user, this.getHttpOptions())
      .pipe(catchError(this.handlerException));
  }

  setAccounts(list: Array<Account>): void {
    this._accountsList = list;
  }

  get accountsList(): Array<Account> {
    return this._accountsList;
  }
}
