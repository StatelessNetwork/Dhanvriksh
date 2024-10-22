import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecentNotificationPage } from './recent-notification.page';

const routes: Routes = [
  {
    path: '',
    component: RecentNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecentNotificationPageRoutingModule {}
