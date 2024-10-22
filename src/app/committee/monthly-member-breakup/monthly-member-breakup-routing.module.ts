import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthlyMemberBreakupPage } from './monthly-member-breakup.page';

const routes: Routes = [
  {
    path: '',
    component: MonthlyMemberBreakupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyMemberBreakupPageRoutingModule {}
