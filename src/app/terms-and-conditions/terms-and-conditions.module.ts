import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsAndConditionsPageRoutingModule } from './terms-and-conditions-routing.module';

import { TermsAndConditionsPage } from './terms-and-conditions.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsAndConditionsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TermsAndConditionsPage]
})
export class TermsAndConditionsPageModule {}
