import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormWizardPageRoutingModule } from './form-wizard-routing.module';

import { FormWizardPage } from './form-wizard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormWizardPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [FormWizardPage]
})
export class FormWizardPageModule {}
