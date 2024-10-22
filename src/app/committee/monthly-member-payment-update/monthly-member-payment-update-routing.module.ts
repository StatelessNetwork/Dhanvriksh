import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthlyMemberPaymentUpdatePage } from './monthly-member-payment-update.page';

const routes: Routes = [
  {
    path: '',
    component: MonthlyMemberPaymentUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyMemberPaymentUpdatePageRoutingModule {}
