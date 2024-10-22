import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegsiterByMobileNumberPageRoutingModule } from './regsiter-by-mobile-number-routing.module';

import { RegsiterByMobileNumberPage } from './regsiter-by-mobile-number.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegsiterByMobileNumberPageRoutingModule
  ],
  declarations: [RegsiterByMobileNumberPage]
})
export class RegsiterByMobileNumberPageModule {}
