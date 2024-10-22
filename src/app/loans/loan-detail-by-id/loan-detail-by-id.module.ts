import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanDetailByIdPageRoutingModule } from './loan-detail-by-id-routing.module';

import { LoanDetailByIdPage } from './loan-detail-by-id.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoanDetailByIdPageRoutingModule
  ],
  declarations: [LoanDetailByIdPage]
})
export class LoanDetailByIdPageModule {}
