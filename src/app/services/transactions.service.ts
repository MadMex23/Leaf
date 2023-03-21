import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  _urlTransactions: string = 'http://localhost:8080/transactions';
  _transactionsList: Array<Transaction> = [];
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
    return throwError(() => 'Comunication Error');
  }

  getTransactionsByAccount(accountId: number): Observable<any> {
    return this.http.get(
      this._urlTransactions + '/account?accountId=' + accountId,
      this.getHttpOptions()
    );
  }

  addTransaction(transaction: Transaction): Observable<any> {
    return this.http
      .post<Transaction>(
        this._urlTransactions + '/add',
        transaction,
        this.getHttpOptions()
      )
      .pipe(catchError(this.handlerException));
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(
      `${this._urlTransactions}/${id}`,
      this.getHttpOptions()
    );
  }
}
