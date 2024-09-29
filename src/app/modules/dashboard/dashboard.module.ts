import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {RouterModule, Routes} from "@angular/router";
import {MatModule} from "../../mat.module";
import {ReactiveFormsModule} from "@angular/forms";
import { ForwardMessageComponent } from './pages/forward-message/forward-message.component';
import {DashboardService} from "./service/dashboard.service";
import {PickerModule} from "@ctrl/ngx-emoji-mart";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [DashboardComponent, ForwardMessageComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    PickerModule
  ],
  providers: [DashboardService],
})
export class DashboardModule { }
