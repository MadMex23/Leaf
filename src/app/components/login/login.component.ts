import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CryptoService } from 'src/app/services/crypto.service';
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
  displayError: Object = {
    email: false,
    password: false,
  };

  constructor(
    formBuilder: FormBuilder,
    private userService: UsersService,
    private router: Router,
    private cryptoService: CryptoService
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
    Object.keys(this.displayError).forEach(
      (v) => (this.displayError[v] = true)
    );
    this.isEmailValid(this.loginValues.controls['email'].errors);
    this.isPasswordValid(this.loginValues.controls['password'].errors);

    if (!this.loginValues.invalid) {
      this.user.email = this.loginValues.value.email;
      this.user.password = this.loginValues.value.password;
      this.userService.loginUser(this.user).subscribe((response) => {
        if (response.success) {
          this.cryptoService.set({
            userId: response.data.id,
            userName: response.data.name + ' ' + response.data.lastName,
          });
          this.router.navigate(['/', 'home']);
          window.location.reload();
        }
      });
    }
  }
}
