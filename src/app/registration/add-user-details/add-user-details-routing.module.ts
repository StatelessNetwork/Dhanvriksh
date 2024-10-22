import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserDetailsPage } from './add-user-details.page';

const routes: Routes = [
  {
    path: '',
    component: AddUserDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUserDetailsPageRoutingModule {}
