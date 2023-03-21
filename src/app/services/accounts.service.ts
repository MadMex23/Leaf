import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Account } from '../models/account';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  _userId: string = localStorage.getItem('userId');
  _urlAccounts: string = 'http://localhost:8080/accounts';
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

  getAccountsByUser(): Observable<any> {
    return this.http.get(
      this._urlAccounts + '/user?userId=' + Number(this._userId),
      this.getHttpOptions()
    );
  }

  getAccountById(id: number): Observable<any> {
    return this.http.get(this._urlAccounts + `/${id}`, this.getHttpOptions());
  }

  addAccount(account: Account): Observable<any> {
    return this.http.post<Account>(
      this._urlAccounts + '/add',
      account,
      this.getHttpOptions()
    );
  }

  updateAccount(id: number, account: Account): Observable<any> {
    return this.http.put<Account>(
      `${this._urlAccounts}/${id}`,
      account,
      this.getHttpOptions()
    );
  }

  deleteAccount(id: number) {
    return this.http.delete(
      `${this._urlAccounts}/${id}`,
      this.getHttpOptions()
    );
  }
}
