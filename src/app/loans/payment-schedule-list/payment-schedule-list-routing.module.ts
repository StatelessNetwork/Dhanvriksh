import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentScheduleListPage } from './payment-schedule-list.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentScheduleListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentScheduleListPageRoutingModule {}
