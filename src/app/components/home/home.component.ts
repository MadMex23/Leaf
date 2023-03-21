import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { AccountsService } from 'src/app/services/accounts.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: string = localStorage.getItem('user');
  accountsList: Array<Account> = [];
  showAccount: boolean = false;
  homeAccountsDiv: any = document.getElementById('accounts-list');
  activeAccountId: number;
  activeAccountData: any;
  accountsListModified: Array<any> = [];

  constructor(
    private modalService: ModalService,
    private userService: UsersService,
    private transactions: TransactionsService,
    private aService: AccountsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.accounts.length) {
      this.accountsList = this.accounts;
      this.accountsListModified = this.accounts;
      this.calculateCurrentBalance();
    } else {
      this.aService.getAccountsByUser().subscribe((response) => {
        this.accountsList = response.data;
        this.accountsListModified = response.data;
        this.calculateCurrentBalance();
      });
    }
  }

  logOut(): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to logout from your account?',
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
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      }
    });
  }

  get isModalOpen(): boolean {
    return this.modalService.isModalOpen;
  }

  get addAccountModal(): boolean {
    return this.modalService.addAccountModal;
  }

  get accounts(): Array<Account> {
    return this.userService.accountsList;
  }

  showModal(): void {
    this.modalService.changeModal(true);
    this.modalService.accessNewAccountModal(true);
  }

  calculateCurrentBalance(): void {
    this.accountsListModified.forEach((account) => {
      let currentBalance: number = account.initialBalance;
      let totalTransactions: number = 0;
      let totalDeposits: number = 0;
      let totalExpenses: number = 0;

      this.transactions.getTransactionsByAccount(account.id).subscribe(
        (response) => {
          response.data?.forEach((transaction: Transaction) => {
            if (transaction.type === 'Deposit') {
              totalDeposits += transaction.amount;
              currentBalance += transaction.amount;
              totalTransactions++;
            } else {
              totalExpenses += transaction.amount;
              currentBalance -= transaction.amount;
              totalTransactions++;
            }
          });
          account.currentBalance = currentBalance;
          account.totalTransactions = totalTransactions;
          account.totalDeposits = totalDeposits;
          account.totalExpenses = totalExpenses;
        },
        (error) => console.log(error)
      );
    });
  }

  changeTab(accountId: number) {
    let accountsDivs = document.querySelectorAll('.tabs');
    accountsDivs?.forEach((tab) => {
      tab.classList.remove('active-account');
      if (tab.id === `div${accountId}`) {
        tab.classList.add('active-account');
        this.activeAccountId = accountId;
        this.activeAccountData = this.accountsListModified.find(
          (account) => account.id === accountId
        );
      }
    });
    if (accountId === 0) {
      this.showAccount = false;
    } else {
      this.showAccount = true;
    }
  }
}
