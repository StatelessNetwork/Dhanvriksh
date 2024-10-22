import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitteeMappingMemberPageRoutingModule } from './committee-mapping-member-routing.module';

import { CommitteeMappingMemberPage } from './committee-mapping-member.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitteeMappingMemberPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [CommitteeMappingMemberPage]
})
export class CommitteeMappingMemberPageModule {}
