import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from '../services/util.service';
import { IonRouterOutlet, IonTabs, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-loan-tabs',
  templateUrl: './loan-tabs.page.html',
  styleUrls: ['./loan-tabs.page.scss'],
})
export class LoanTabsPage implements OnInit {
  @ViewChild('tabs', { static: false }) tabs: IonTabs | any;
  selectedTab: any;
  constructor(public util: UtilService,private navCtrl: NavController,
    public platform:Platform, private routerOutlet:IonRouterOutlet
  ) { }

  ngOnInit() {
  }

  redirectToTabs(type:string) {
    if(type=='home')
    this.navCtrl.navigateRoot('/tabs/dashboard'); // Redirects to LoanTabsPage
    else   if(type=='committee')
    this.navCtrl.navigateRoot('/committee-tabs/committee-list'); 
    else   if(type=='profile')
      this.navCtrl.navigateRoot('/profile'); 
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


}
