import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: User = new User();
  loginValues: FormGroup;
  emailError: string;
  passwordError: string;
  showPassword: boolean = false;
  showErrors: boolean = false;
  accountsList: Array<Account> = [];

  constructor(
    formBuilder: FormBuilder,
    private userService: UsersService,
    private router: Router
  ) {
    this.loginValues = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {}

  changePasswordType(): void {
    this.showPassword = !this.showPassword;
  }

  isEmailValid(errors: Object): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.emailError = 'Email cannot be blank.';
      } else if (errors['email']) {
        this.emailError = 'Email is not valid.';
      }
    } else {
      this.emailError = '';
      valid = true;
    }
    return valid;
  }

  isPasswordValid(errors: ValidationErrors | null): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.passwordError = 'Password cannot be blank.';
      }
    } else {
      this.passwordError = '';
      valid = true;
    }
    return valid;
  }

  submitLogin(): void {
    this.isEmailValid(this.loginValues.controls['email'].errors);
    this.isPasswordValid(this.loginValues.controls['password'].errors);
    this.showErrors = true;

    if (!this.loginValues.invalid) {
      this.showErrors = false;
      this.user.email = this.loginValues.value.email;
      this.user.password = this.loginValues.value.password;
      this.userService.loginUser(this.user).subscribe((response) => {
        if (response.success) {
          localStorage.setItem(
            'user',
            response.data.name + ' ' + response.data.lastName
          );
          localStorage.setItem('userId', response.data.id);
          this.userService.setAccounts(response.data.accounts);
          this.router.navigate(['/', 'home']);
        }
      });
    }
  }
}
