import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocumentsUploadPageRoutingModule } from './documents-upload-routing.module';

import { DocumentsUploadPage } from './documents-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocumentsUploadPageRoutingModule
  ],
  declarations: [DocumentsUploadPage]
})
export class DocumentsUploadPageModule {}
