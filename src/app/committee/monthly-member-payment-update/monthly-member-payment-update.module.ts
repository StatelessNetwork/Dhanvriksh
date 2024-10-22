import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonthlyMemberPaymentUpdatePageRoutingModule } from './monthly-member-payment-update-routing.module';

import { MonthlyMemberPaymentUpdatePage } from './monthly-member-payment-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MonthlyMemberPaymentUpdatePageRoutingModule
  ],
  declarations: [MonthlyMemberPaymentUpdatePage]
})
export class MonthlyMemberPaymentUpdatePageModule {}
