import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentsUploadPage } from './documents-upload.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentsUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsUploadPageRoutingModule {}
