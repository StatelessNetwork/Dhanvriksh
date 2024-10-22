import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNewCommitteePage } from './add-new-committee.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewCommitteePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNewCommitteePageRoutingModule {}
