import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteeDetailsPage } from './committee-details.page';

const routes: Routes = [
  {
    path: '',
    component: CommitteeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteeDetailsPageRoutingModule {}
