import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddExistingMemberPageRoutingModule } from './add-existing-member-routing.module';

import { AddExistingMemberPage } from './add-existing-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddExistingMemberPageRoutingModule
  ],
  declarations: [AddExistingMemberPage]
})
export class AddExistingMemberPageModule {}
