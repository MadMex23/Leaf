import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  signUpForm: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  changeForm(): void {
    this.signUpForm = !this.signUpForm;
  }
}
