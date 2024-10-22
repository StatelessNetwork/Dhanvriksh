import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitteeDetailsPageRoutingModule } from './committee-details-routing.module';

import { CommitteeDetailsPage } from './committee-details.page';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitteeDetailsPageRoutingModule,
    NgCircleProgressModule.forRoot()
  ],
  declarations: [CommitteeDetailsPage]
})
export class CommitteeDetailsPageModule {}
