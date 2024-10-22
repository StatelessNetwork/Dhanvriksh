import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberListPageRoutingModule } from './member-list-routing.module';

import { MemberListPage } from './member-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberListPageRoutingModule
  ],
  declarations: [MemberListPage]
})
export class MemberListPageModule {}
