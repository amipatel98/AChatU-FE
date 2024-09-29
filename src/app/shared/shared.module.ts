import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatModule} from "../mat.module";
import {FlexLayoutModule} from "@angular/flex-layout";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatModule,
    FlexLayoutModule
  ],
  exports: [
    MatModule,
    FlexLayoutModule
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
