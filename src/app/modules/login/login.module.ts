import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {MatModule} from "../../mat.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ToastrModule} from 'ngx-toastr';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [LoginComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
    ]
})
export class LoginModule { }
