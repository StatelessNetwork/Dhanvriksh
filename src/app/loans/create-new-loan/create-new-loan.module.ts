import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewLoanPageRoutingModule } from './create-new-loan-routing.module';

import { CreateNewLoanPage } from './create-new-loan.page';
import { MemberAutocompleteComponent } from 'src/app/shared/member-autocomplete/member-autocomplete.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateNewLoanPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateNewLoanPage]
})
export class CreateNewLoanPageModule {}
