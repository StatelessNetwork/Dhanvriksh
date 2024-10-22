import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TestPageRoutingModule } from './test-routing.module';
import { TestPage } from './test.page';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestPageRoutingModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    NgCircleProgressModule.forRoot()
  ],
  declarations: [TestPage]
})
export class TestPageModule {}
