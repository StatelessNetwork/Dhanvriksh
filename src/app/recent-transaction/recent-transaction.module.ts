import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecentTransactionPageRoutingModule } from './recent-transaction-routing.module';

import { RecentTransactionPage } from './recent-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecentTransactionPageRoutingModule
  ],
  declarations: [RecentTransactionPage]
})
export class RecentTransactionPageModule {}
