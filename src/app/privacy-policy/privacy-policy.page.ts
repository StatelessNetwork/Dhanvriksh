import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { LanguageService } from '../services/language.service';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  resourceData:any;
  constructor(public util: UtilService,
    private _language:LanguageService,
    private navCtrl: NavController,
    private _storageService:StorageService) {
    this._storageService.get(applicationObject.resourceData).then((data: any) => {
    if (data) {
      this.resourceData=data;
    } 
  }); 
}

  ngOnInit() {
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  goBack() {
    this.navCtrl.back();
  }

}
