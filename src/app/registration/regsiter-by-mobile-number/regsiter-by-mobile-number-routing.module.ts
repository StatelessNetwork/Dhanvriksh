import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegsiterByMobileNumberPage } from './regsiter-by-mobile-number.page';

const routes: Routes = [
  {
    path: '',
    component: RegsiterByMobileNumberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegsiterByMobileNumberPageRoutingModule {}
