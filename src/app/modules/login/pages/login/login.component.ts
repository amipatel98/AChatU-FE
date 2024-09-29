import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../services/login.service";
import {ToastrService} from "ngx-toastr";
import Swal from 'sweetalert2'
import {LoginModel} from "../../model/login.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  decodedToken;
  constructor(private router: Router, fb: FormBuilder, private loginService: LoginService, private toastr: ToastrService) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loginService.checkLogin();
  }

  registration() {
    this.router.navigate(['/signup']);
  }

  get f() {
    return this.loginForm.controls;
  }

  /** @description logIn() is used to authenticate the user */
  logIn() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loginService.login(this.loginForm.value).subscribe((res: LoginModel) => {
      if(res) {
        this.loginService.setToken(res.authorization);
        // this.loginService.setUserId(res.data._id);
        this.decodedToken = this.loginService.getUserId();
        if (!this.decodedToken.isActive) {
          Swal.fire({
            title: 'Your account is blocked by admin',
            text: 'Contact to Admin: admin@gmail.com',
            icon: 'error',
            showCloseButton: true,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.value) {
              localStorage.clear();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              localStorage.clear();
            }
          })
        } else {
          this.loginService.checkLogin();
        }
      }
    }, error => {
      console.log('Error', error);
      this.toastr.error('Account is not register', 'Error');
    });
  }
}
