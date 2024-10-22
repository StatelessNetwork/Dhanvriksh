import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from '../services/util.service';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { IonTabs, Platform } from '@ionic/angular/common';

@Component({
  selector: 'app-committee-tabs',
  templateUrl: './committee-tabs.page.html',
  styleUrls: ['./committee-tabs.page.scss'],
})
export class CommitteeTabsPage implements OnInit {
  @ViewChild('tabs', { static: false }) tabs: IonTabs | any;
  selectedTab: any;
  constructor(
    public util: UtilService,
    private navCtrl: NavController,
    public platform:Platform, private routerOutlet:IonRouterOutlet
  ) { }

  ngOnInit() {
  }

  redirectToTabs(type:string) {
    if(type=='home')
    this.navCtrl.navigateRoot('/tabs/dashboard'); // Redirects to LoanTabsPage
    else   if(type=='loan')
    this.navCtrl.navigateRoot('/loan-tabs/loan-list'); 
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
