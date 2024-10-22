import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from '../services/util.service';
import { IonRouterOutlet, IonTabs, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  @ViewChild('tabs', { static: false }) tabs: IonTabs | any;
  selectedTab: any;
  constructor(
    public util: UtilService,
    private navCtrl: NavController,
    public platform:Platform, private routerOutlet:IonRouterOutlet
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.routerOutlet.swipeGesture = false;
  }

  ionViewWillLeave() {
    this.routerOutlet.swipeGesture = true;
  }

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }

  redirectToTabs(type:string) {
    if(type=='home')
    this.navCtrl.navigateRoot('/tabs/dashboard'); // Redirects to LoanTabsPage
    else   if(type=='committee')
    this.navCtrl.navigateRoot('/committee-tabs/committee-list'); 
    else   if(type=='loan')
      this.navCtrl.navigateRoot('/loan-tabs/loan-list'); 
    else   if(type=='profile')
      this.navCtrl.navigateRoot('/profile'); 
  }


}
