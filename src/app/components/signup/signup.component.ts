import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { IndexComponent } from '../index/index.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  newUser: User = new User();
  signupValues: FormGroup;
  securePass: RegExp = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  );
  validName: RegExp = new RegExp("^[A-Za-z][A-Za-z'-]+([ A-Za-z][A-Za-z'-]+)*");
  minNameChars: number = 2;
  maxNameChars: number = 25;
  nameError: string;
  lastNameError: string;
  emailError: string;
  passwordError: string;
  rePasswordError: string;
  showPassword: boolean = false;
  showRePassword: boolean = false;
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
    formBuilder: FormBuilder,
    private user: UsersService,
    private index: IndexComponent
  ) {
    this.signupValues = formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(this.minNameChars),
          Validators.maxLength(this.maxNameChars),
          Validators.pattern(this.validName),
        ]),
      ],
      last_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(this.minNameChars),
          Validators.maxLength(this.maxNameChars),
          Validators.pattern(this.validName),
        ]),
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.securePass),
        ]),
      ],
      repassword: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {}

  changePasswordType(): void {
    this.showPassword = !this.showPassword;
  }

  changeRePasswordType(): void {
    this.showRePassword = !this.showRePassword;
  }

  isNameValid(errors: Object): boolean {
    let valid = false;
    if (errors) {
      console.log(errors);
      if (errors['required']) {
        this.nameError = 'Name cannot be blank.';
      } else if (errors['minlength'] || errors['maxlength']) {
        this.nameError =
          'Name must have between ' +
          this.minNameChars +
          ' and ' +
          this.maxNameChars +
          ' characters.';
      } else if (errors['pattern']) {
        this.nameError =
          'Name can only contain letters, whitespaces, hyphens and apostrophes.';
      }
    } else {
      this.nameError = '';
      valid = true;
    }
    return valid;
  }

  isLastNameValid(errors: Object): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.lastNameError = 'Last name cannot be blank.';
      } else if (errors['minlength'] || errors['maxlength']) {
        this.lastNameError = 'Last name must have between 2 and 25 characters.';
      } else if (errors['pattern']) {
        this.lastNameError =
          'Last name can only contain letters, whitespaces, hyphens and apostrophes.';
      }
    } else {
      this.lastNameError = '';
      valid = true;
    }
    return valid;
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

  isPasswordValid(errors: Object): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.passwordError = 'Password cannot be blank.';
      } else if (errors['pattern']) {
        this.passwordError =
          'Password must has at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 special character in (!@#$%^&*)';
      }
    } else {
      this.passwordError = '';
      valid = true;
    }
    return valid;
  }

  isRePasswordValid(errors: Object): boolean {
    let valid = false;
    if (errors) {
      if (errors['required']) {
        this.rePasswordError = 'Password cannot be blank.';
      }
    } else if (
      this.signupValues.value.password !== this.signupValues.value.repassword
    ) {
      this.rePasswordError = "Passwords doesn't match.";
    } else {
      this.rePasswordError = '';
      valid = true;
    }
    return valid;
  }

  showErrors(): void {
    this.isNameValid(this.signupValues.controls['name'].errors);
    this.isLastNameValid(this.signupValues.controls['last_name'].errors);
    this.isEmailValid(this.signupValues.controls['email'].errors);
    this.isPasswordValid(this.signupValues.controls['password'].errors);
    this.isRePasswordValid(this.signupValues.controls['repassword'].errors);
  }

  submitSignup(): void {
    this.showErrors();
    if (
      !this.signupValues.invalid &&
      this.isRePasswordValid(this.signupValues.controls['repassword'].errors)
    ) {
      this.newUser.name = this.signupValues.value.name;
      this.newUser.last_name = this.signupValues.value.last_name;
      this.newUser.email = this.signupValues.value.email;
      this.newUser.password = this.signupValues.value.password;
      this.user
        .signupUser(this.newUser)
        .subscribe((response) => console.log(response));
      this.index.changeForm();
      this.toast.fire({
        icon: 'success',
        title: 'User registered.',
      });
    }
  }
}
