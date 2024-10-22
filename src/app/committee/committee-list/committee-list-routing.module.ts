import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteeListPage } from './committee-list.page';

const routes: Routes = [
  {
    path: '',
    component: CommitteeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteeListPageRoutingModule {}
