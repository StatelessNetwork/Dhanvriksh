import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoanTabsPageRoutingModule } from './loan-tabs-routing.module';

import { LoanTabsPage } from './loan-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoanTabsPageRoutingModule
  ],
  declarations: [LoanTabsPage]
})
export class LoanTabsPageModule {}
