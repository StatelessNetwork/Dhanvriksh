import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentTransactionPage } from './recent-transaction.page';

const routes: Routes = [
  {
    path: '',
    component: RecentTransactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentTransactionPageRoutingModule {}
