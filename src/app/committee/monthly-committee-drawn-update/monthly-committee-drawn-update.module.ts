import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonthlyCommitteeDrawnUpdatePageRoutingModule } from './monthly-committee-drawn-update-routing.module';

import { MonthlyCommitteeDrawnUpdatePage } from './monthly-committee-drawn-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MonthlyCommitteeDrawnUpdatePageRoutingModule
  ],
  declarations: [MonthlyCommitteeDrawnUpdatePage]
})
export class MonthlyCommitteeDrawnUpdatePageModule {}
