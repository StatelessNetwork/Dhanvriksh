import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitteeMonthlyBreakupPageRoutingModule } from './committee-monthly-breakup-routing.module';

import { CommitteeMonthlyBreakupPage } from './committee-monthly-breakup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitteeMonthlyBreakupPageRoutingModule
  ],
  declarations: [CommitteeMonthlyBreakupPage]
})
export class CommitteeMonthlyBreakupPageModule {}
