import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import {MatModule} from "../../mat.module";
import {RouterModule, Routes} from "@angular/router";
import { RegistrationComponent } from './pages/registration/registration.component';
import {CoreModule} from "../../core/core.module";
import {ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'admin-registration',
    component: RegistrationComponent
  },
];

@NgModule({
  declarations: [AdminDashboardComponent, RegistrationComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatModule,
        ReactiveFormsModule,
        CoreModule
    ]
})
export class AdminDashboardModule { }
