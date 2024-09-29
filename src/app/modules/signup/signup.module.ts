import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './pages/signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import {MatModule} from "../../mat.module";
import {ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: SignupComponent
  }
];

@NgModule({
  declarations: [SignupComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatModule,
        ReactiveFormsModule
    ]
})
export class SignupModule { }
