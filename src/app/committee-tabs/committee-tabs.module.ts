import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitteeTabsPageRoutingModule } from './committee-tabs-routing.module';

import { CommitteeTabsPage } from './committee-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitteeTabsPageRoutingModule
  ],
  declarations: [CommitteeTabsPage]
})
export class CommitteeTabsPageModule {}
