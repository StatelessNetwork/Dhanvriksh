import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonthlyMemberBreakupPageRoutingModule } from './monthly-member-breakup-routing.module';

import { MonthlyMemberBreakupPage } from './monthly-member-breakup.page';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonthlyMemberBreakupPageRoutingModule,
    NgCircleProgressModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [MonthlyMemberBreakupPage]
})
export class MonthlyMemberBreakupPageModule {}
