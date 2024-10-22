import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteeMappingMemberPage } from './committee-mapping-member.page';

const routes: Routes = [
  {
    path: '',
    component: CommitteeMappingMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteeMappingMemberPageRoutingModule {}
