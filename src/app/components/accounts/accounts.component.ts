import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home/home.component';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  @Input() accountId: number;
  @Input() accountData: any;
  accountInfo: any;
  activeAccount: Account;
  accountTransactions: Array<Transaction> = [];
  toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    color: '#232931',
    iconColor: '#232931',
    background: '#2aa98a',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  constructor(
    private modalService: ModalService,
    private account: AccountsService,
    private home: HomeComponent,
    private transactions: TransactionsService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['accountId'].currentValue != changes['accountId'].previousValue
    ) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.account.getAccountById(this.accountId).subscribe((response) => {
      (this.activeAccount = response), (error) => console.log(error);
    });
    this.transactions
      .getTransactionsByAccount(this.accountId)
      .subscribe((response) => {
        (this.accountTransactions = response), (error) => console.log(error);
      });
  }

  get isModalOpen(): boolean {
    return this.modalService.isModalOpen;
  }

  showModal(): void {
    this.modalService.changeModal(true);
    this.accountInfo = {
      id: this.accountData.id,
      userId: this.accountData.userId,
      name: this.accountData.name,
      type: this.accountData.type,
      initialBalance: this.accountData.initialBalance,
    };
  }

  deleteAccount(): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this account? All his transactions will also be deleted.',
      icon: 'warning',
      color: '#2aa98a',
      iconColor: '#2aa98a',
      background: '#232931',
      showCancelButton: true,
      confirmButtonColor: '#2aa98a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        this.account.deleteAccount(this.accountId).subscribe((response) => {
          this.transactions
            .getTransactionsByAccount(this.accountId)
            .subscribe((response) => {
              response.forEach((transaction) => {
                this.transactions
                  .deleteTransaction(transaction.id)
                  .subscribe((response) => {
                    console.log(response), (error) => console.log(error);
                  });
              }),
                (error) => console.log(error);
            });
          this.home.ngOnInit();
          this.home.changeTab(0);
          this.toast.fire({
            icon: 'success',
            title: 'Account deleted.',
          });
        });
      }
    });
  }

  deleteTransaction(event): void {
    console.log(event);
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this transaction?',
      icon: 'warning',
      color: '#2aa98a',
      iconColor: '#2aa98a',
      background: '#232931',
      showCancelButton: true,
      confirmButtonColor: '#2aa98a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        this.transactions
          .deleteTransaction(event.target.parentElement.parentElement.id)
          .subscribe((response) => {
            console.log(response), (error) => console.log(error);
            this.ngOnInit();
            this.home.calculateCurrentBalance();
            this.toast.fire({
              icon: 'success',
              title: 'Transaction deleted.',
            });
          });
      }
    });
  }
}
