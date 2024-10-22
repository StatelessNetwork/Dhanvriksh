import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddExistingMemberPage } from './add-existing-member.page';

const routes: Routes = [
  {
    path: '',
    component: AddExistingMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddExistingMemberPageRoutingModule {}
