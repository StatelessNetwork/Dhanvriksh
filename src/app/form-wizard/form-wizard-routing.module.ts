import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormWizardPage } from './form-wizard.page';

const routes: Routes = [
  {
    path: '',
    component: FormWizardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormWizardPageRoutingModule {}
