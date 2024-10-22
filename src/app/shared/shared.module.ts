import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberAutocompleteComponent } from './member-autocomplete/member-autocomplete.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MemberAutocompleteComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports:[MemberAutocompleteComponent]
})
export class SharedModule { }
