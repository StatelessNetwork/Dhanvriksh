import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanListPageRoutingModule } from './loan-list-routing.module';

import { LoanListPage } from './loan-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoanListPageRoutingModule
  ],
  declarations: [LoanListPage]
})
export class LoanListPageModule {}
