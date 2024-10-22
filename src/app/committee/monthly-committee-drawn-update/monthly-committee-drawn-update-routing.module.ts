import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthlyCommitteeDrawnUpdatePage } from './monthly-committee-drawn-update.page';

const routes: Routes = [
  {
    path: '',
    component: MonthlyCommitteeDrawnUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyCommitteeDrawnUpdatePageRoutingModule {}
