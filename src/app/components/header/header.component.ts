import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input('header') header: any
  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goBack(){
    this.navCtrl.back();
  }

}
