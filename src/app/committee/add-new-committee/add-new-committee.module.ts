import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewCommitteePageRoutingModule } from './add-new-committee-routing.module';

import { AddNewCommitteePage } from './add-new-committee.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddNewCommitteePageRoutingModule,
    ComponentsModule
  ],
  declarations: [AddNewCommitteePage],
  providers:[DatePipe]
})
export class AddNewCommitteePageModule {}
