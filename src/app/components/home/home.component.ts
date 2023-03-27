import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Transaction } from 'src/app/models/transaction';
import { User } from 'src/app/models/user';
import { AccountsService } from 'src/app/services/accounts.service';
import { CryptoService } from 'src/app/services/crypto.service';
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
  user: string = this.cryptoService.get().userName;
  userId: string = this.cryptoService.get().userId;
  homeAccountsDiv: any = document.getElementById('accounts-list');
  showAccount: boolean = false;
  activeAccountId: number;
  activeAccountData: any;
  accountsList: Array<Account> = [];
  accountsListModified: Array<any> = [];

  constructor(
    private modalService: ModalService,
    private userService: UsersService,
    private transactions: TransactionsService,
    private aService: AccountsService,
    private router: Router,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {
    this.aService
      .getAccountsByUser(Number(this.userId))
      .subscribe((response) => {
        this.accountsList = response.data;
        this.accountsListModified = response.data;
        this.calculateCurrentBalance();
      });
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

  async deleteUser() {
    const { value: password } = await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete your Leaf account and everything inside it? Please insert your password to confirm.',
      input: 'password',
      inputPlaceholder: 'Enter your password',
      icon: 'warning',
      color: '#2aa98a',
      iconColor: '#d33',
      background: '#232931',
      showCancelButton: true,
      confirmButtonColor: '#2aa98a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    });

    if (password) {
      let user: User = new User();
      let toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        color: '#232931',
        iconColor: '#232931',
        background: '#ff5c5c',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: false,
      });
      user.password = password;
      this.userService
        .deleteUser(Number(this.cryptoService.get().userId), user)
        .subscribe((response) => {
          if (response.success) {
            toast
              .fire({
                icon: 'warning',
                title: response.message,
              })
              .then(() => {
                localStorage.removeItem('user');
                this.router.navigate(['/']);
              });
          }
        });
    }
  }
}
