import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoanListPage } from './loan-list.page';

const routes: Routes = [
  {
    path: '',
    component: LoanListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanListPageRoutingModule {}
