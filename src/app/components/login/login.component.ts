import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user';

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

  constructor(formBuilder: FormBuilder) {
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

    if (!this.loginValues.invalid) {
      this.user.email = this.loginValues.value.email;
      this.user.password = this.loginValues.value.password;
      console.log('Adentro', this.user);
      this.loginValues.reset();
    }
  }
}
