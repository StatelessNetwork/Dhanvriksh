import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentNotificationPageRoutingModule } from './recent-notification-routing.module';

import { RecentNotificationPage } from './recent-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentNotificationPageRoutingModule
  ],
  declarations: [RecentNotificationPage]
})
export class RecentNotificationPageModule {}
