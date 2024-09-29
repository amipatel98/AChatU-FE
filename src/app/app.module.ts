import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatModule } from './mat.module';
import { LoginModule } from './modules/login/login.module';
import { SignupModule } from './modules/signup/signup.module';
import {DashboardModule} from "./modules/dashboard/dashboard.module";
import {HttpClientModule} from "@angular/common/http";
import {AdminDashboardModule} from "./modules/admin/admin-dashboard.module";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {SharedModule} from "./shared/shared.module";

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    SignupModule,
    DashboardModule,
    AdminDashboardModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
