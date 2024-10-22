import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteeMonthlyBreakupPage } from './committee-monthly-breakup.page';

const routes: Routes = [
  {
    path: '',
    component: CommitteeMonthlyBreakupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteeMonthlyBreakupPageRoutingModule {}
