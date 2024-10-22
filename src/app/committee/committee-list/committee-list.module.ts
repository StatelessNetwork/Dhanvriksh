import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitteeListPageRoutingModule } from './committee-list-routing.module';

import { CommitteeListPage } from './committee-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitteeListPageRoutingModule
  ],
  declarations: [CommitteeListPage]
})
export class CommitteeListPageModule {}
