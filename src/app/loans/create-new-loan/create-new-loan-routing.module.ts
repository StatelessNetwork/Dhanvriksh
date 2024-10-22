import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNewLoanPage } from './create-new-loan.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNewLoanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewLoanPageRoutingModule {}
