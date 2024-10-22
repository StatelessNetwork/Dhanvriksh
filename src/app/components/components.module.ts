import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "./header/header.component";

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule { }
