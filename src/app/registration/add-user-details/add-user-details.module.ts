import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUserDetailsPageRoutingModule } from './add-user-details-routing.module';

import { AddUserDetailsPage } from './add-user-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddUserDetailsPageRoutingModule
  ],
  declarations: [AddUserDetailsPage]
})
export class AddUserDetailsPageModule {}
