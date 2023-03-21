import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from 'src/app/models/transaction';
import { TransactionsService } from 'src/app/services/transactions.service';
import Swal from 'sweetalert2';
import { AccountsComponent } from '../accounts/accounts.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit {
  @Input() accountId: number;
  userId: number = Number(localStorage.getItem('userId'));
  transaction: Transaction = new Transaction();
  transactionValues: FormGroup;
  minDescriptionChars: number = 2;
  maxDescriptionChars: number = 30;
  typeError: string;
  descriptionError: string;
  dateError: string;
  amountError: string;
  maxAmount: number = 9999999999;
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
    private service: TransactionsService,
    private account: AccountsComponent,
    private home: HomeComponent,
    formBuilder: FormBuilder
  ) {
    this.transactionValues = formBuilder.group({
      type: ['', Validators.required],
      description: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(this.minDescriptionChars),
          Validators.maxLength(this.maxDescriptionChars),
        ]),
      ],
      date: ['', Validators.required],
      amount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.max(this.maxAmount),
          Validators.pattern(
            '^(0*[1-9][0-9]*(.[0-9]+)?|0+.[0-9]*[1-9][0-9]*)$'
          ),
        ]),
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['accountId'].currentValue != changes['accountId'].previousValue
    ) {
      this.transactionValues.reset({ type: '' });
      this.typeError = '';
      this.descriptionError = '';
      this.dateError = '';
      this.amountError = '';
    }
  }

  ngOnInit(): void {}

  isTypeValid(errors: any): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.typeError = 'You must select a transaction type.';
      }
    } else {
      this.typeError = '';
      valid = true;
    }
    return valid;
  }

  isDescriptionValid(errors: any): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.descriptionError = 'Description cannot be blank.';
      } else if (errors['minlength'] || errors['maxlength']) {
        this.descriptionError =
          'Description must have between ' +
          this.minDescriptionChars +
          ' and ' +
          this.maxDescriptionChars +
          ' characters.';
      }
    } else {
      this.descriptionError = '';
      valid = true;
    }
    return valid;
  }

  isDateValid(errors: any): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.dateError = 'You must select a date.';
      }
    } else if (new Date(this.transactionValues.value.date) > new Date()) {
      this.dateError = 'Date cannot be in the future.';
    } else {
      this.dateError = '';
      valid = true;
    }
    return valid;
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  isAmountValid(errors: any): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.amountError = 'Amount cannot be blank.';
      } else if (errors['max']) {
        this.amountError = 'Amount cannot exceed 10 digits.';
      } else if (errors['pattern']) {
        this.amountError = 'Amount cannot be negative or zero.';
      }
    } else {
      this.amountError = '';
      valid = true;
    }
    return valid;
  }

  showErrors() {
    this.isTypeValid(this.transactionValues.controls['type'].errors);
    this.isDescriptionValid(
      this.transactionValues.controls['description'].errors
    );
    this.isDateValid(this.transactionValues.controls['date'].errors);
    this.isAmountValid(this.transactionValues.controls['amount'].errors);
  }

  addTransaction(): void {
    this.showErrors();
    if (
      !this.transactionValues.invalid &&
      this.isDateValid(this.transactionValues.controls['date'].errors)
    ) {
      this.transaction.accountId = this.accountId;
      this.transaction.type = this.transactionValues.value.type;
      this.transaction.description = this.transactionValues.value.description;
      this.transaction.amount = this.transactionValues.value.amount;
      this.transaction.date = this.transactionValues.value.date;

      this.service.addTransaction(this.transaction).subscribe((response) => {
        this.transactionValues.reset({ type: '' });
        this.account.ngOnInit();
        this.home.calculateCurrentBalance();
        this.toast.fire({
          icon: 'success',
          title: response.message,
        });
      });
    }
  }
}
