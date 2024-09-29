import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatModule} from "../mat.module";



@NgModule({
  declarations: [FooterComponent, HeaderComponent, LayoutComponent, SidebarComponent],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MatModule
  ]
})
export class CoreModule { }
