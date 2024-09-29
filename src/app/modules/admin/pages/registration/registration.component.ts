import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SignupService} from "../../../signup/services/signup.service";
import {RegistrationModel} from "../../../signup/model/registration.model";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder,
              private registrationService: SignupService,
              private toastr: ToastrService) {
    this.registrationForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}')]]
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.registrationForm.controls;
  }

  /** @description signUp() is used to registration of admin user */
  signUp() {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.registrationForm.value['role'] = 'admin';
    this.registrationService.signUp(this.registrationForm.value).subscribe((data: RegistrationModel) => {
      console.log('data', data);
      if(data) {
        this.toastr.success('Registration Successfully...', 'Success');
        this.submitted = false;
        this.registrationForm.reset();
      }
    })
  }

}
