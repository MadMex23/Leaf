import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Account } from 'src/app/models/account';
import { AccountsService } from 'src/app/services/accounts.service';
import Swal from 'sweetalert2';
import { AccountsComponent } from '../accounts/accounts.component';
import { HomeComponent } from '../home/home.component';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  providers: [HomeComponent, AccountsComponent],
})
export class ModalComponent implements OnInit {
  @Input() accountData: any;
  newAccount: Account = new Account();
  submitAccount: boolean = false;
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
    private accountComponent: AccountsComponent,
    private home: HomeComponent
  ) {}

  ngOnInit(): void {
    if (this.accountData) {
      this.newAccount.userId = this.accountData.userId;
      this.newAccount.name = this.accountData.name;
      this.newAccount.type = this.accountData.type;
      this.newAccount.initialBalance = this.accountData.initialBalance;
    } else {
      this.newAccount.userId = Number(localStorage.getItem('userId'));
      this.newAccount.type = '';
    }
    window.onclick = (event: any) => {
      const newAccountModal = document.getElementById('newAccountModal');
      if (event.target == newAccountModal) {
        this.closeModal();
      }
    };
  }

  closeModal(): void {
    this.modalService.changeModal(false);
    this.modalService.accessNewAccountModal(false);
  }

  addAccount(newAccountForm: NgForm) {
    this.submitAccount = true;
    if (newAccountForm.invalid) {
      for (const control of Object.keys(newAccountForm.controls)) {
        newAccountForm.controls[control].markAsDirty();
      }
      return;
    } else {
      this.account
        .addAccount(this.newAccount)
        .subscribe((response) => console.log(response));
      this.toast.fire({
        icon: 'success',
        title: 'New account added.',
      });
      this.closeModal();
      window.location.reload();
    }
  }

  editAccount(newAccountForm: NgForm) {
    this.submitAccount = true;
    if (newAccountForm.invalid) {
      for (const control of Object.keys(newAccountForm.controls)) {
        newAccountForm.controls[control].markAsDirty();
      }
      return;
    } else {
      this.account
        .updateAccount(this.accountData.id, this.newAccount)
        .subscribe(
          (response) => console.log(response),
          (error) => console.log(error)
        );
      this.toast.fire({
        icon: 'success',
        title: 'Account updated.',
      });
      window.location.reload();
    }
  }
}
