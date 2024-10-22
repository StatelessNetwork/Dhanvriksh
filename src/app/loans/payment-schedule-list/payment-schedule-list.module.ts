import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentScheduleListPageRoutingModule } from './payment-schedule-list-routing.module';

import { PaymentScheduleListPage } from './payment-schedule-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentScheduleListPageRoutingModule
  ],
  declarations: [PaymentScheduleListPage]
})
export class PaymentScheduleListPageModule {}
