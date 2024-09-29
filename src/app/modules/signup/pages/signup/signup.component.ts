import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignupService} from "../../services/signup.service";
import {LoginService} from "../../../login/services/login.service";
import {RegistrationModel} from "../../model/registration.model";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registrationForm: FormGroup;
  submitted = false;
  decodedToken;
  constructor(private router: Router,
              private fb: FormBuilder,
              private registrationService: SignupService,
              private loginService: LoginService) {
    this.registrationForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}')]]
    });
  }

  ngOnInit(): void {
    this.decodedToken = this.loginService.getUserId();
    if(this.decodedToken) {
      if (this.decodedToken.role === 'admin') {
        localStorage.setItem('userType', this.decodedToken.role);
        this.router.navigate(['/admin-dashboard']);
      } else if (this.decodedToken.role === 'user') {
        localStorage.setItem('userType', this.decodedToken.role);
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/signup']);
      }
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  get f() {
    return this.registrationForm.controls;
  }

  /** @description signUp() is used registered the users */
  signUp() {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.registrationForm.value['role'] = 'user';
    this.registrationService.signUp(this.registrationForm.value).subscribe((data: RegistrationModel) => {
      this.router.navigate(['/login']);
    })
  }

}
