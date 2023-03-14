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
  _urlTransactions: string = 'http://localhost:3000/transactions';
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
    return throwError('Comunication Error');
  }

  getTransactionsByAccount(accountId: number): Observable<Array<Transaction>> {
    return this.http
      .get<Array<Transaction>>(
        this._urlTransactions + '?accountId=' + accountId
      )
      .pipe(catchError(this.handlerException));
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http
      .post<Transaction>(
        this._urlTransactions,
        transaction,
        this.getHttpOptions()
      )
      .pipe(catchError(this.handlerException));
  }

  updateTransaction(
    id: number,
    transaction: Transaction
  ): Observable<Transaction> {
    return this.http
      .put<Transaction>(
        `${this._urlTransactions}/${id}`,
        transaction,
        this.getHttpOptions()
      )
      .pipe(catchError(this.handlerException));
  }

  deleteTransaction(id: number) {
    return this.http.delete(`${this._urlTransactions}/${id}`);
  }
}
