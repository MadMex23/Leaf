import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  _userId: string = localStorage.getItem('userId');
  _urlAccounts: string = 'http://localhost:3000/accounts';
  _accountsList: Array<Account> = [];
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

  getAccountsByUser(): Observable<Array<Account>> {
    return this.http
      .get<Array<Account>>(this._urlAccounts + '?userId=' + this._userId)
      .pipe(catchError(this.handlerException));
  }

  getAccountById(id: number): Observable<Account> {
    return this.http
      .get<Account>(this._urlAccounts + `/${id}`)
      .pipe(catchError(this.handlerException));
  }

  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(
      this._urlAccounts,
      account,
      this.getHttpOptions()
    );
  }

  updateAccount(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(
      `${this._urlAccounts}/${id}`,
      account,
      this.getHttpOptions()
    );
  }

  deleteAccount(id: number) {
    return this.http.delete(`${this._urlAccounts}/${id}`);
  }
}
