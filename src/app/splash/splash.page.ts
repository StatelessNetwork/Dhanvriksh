import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { NavController, Platform } from '@ionic/angular';
import { applicationObject } from '../model/applicationEnum';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage {

  constructor(private _storageService:StorageService,
    private navCtrl: NavController, private platForm:Platform) {
      this._storageService.get(applicationObject.token).then(data => {
        if(data){
          let currentDateTime:any= new Date().getTime();
          let expiryDateTime=new Date(data.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          this.navCtrl.navigateRoot(['/tabs/dashboard']);
        }
        else{
          this._storageService.get(applicationObject.isFirstTimeSliderhOpenApp).then((data) => {
            if(!data){
              this.navCtrl.navigateRoot(['/languages'])
            }
          });
        }
      });
      this.initializeApp();
    }

  initializeApp() {
      this.platForm.ready().then(()=>{
        this._storageService.get(applicationObject.isFirstTimeSliderhOpenApp).then((data) => {
          if(!data){
            if(data==null)
              {  setTimeout(() => {
                this.navCtrl.navigateRoot(['/home']);
              }, 2000);}
            else
              this.navCtrl.navigateRoot(['/login']);
          }
          else{
            setTimeout(() => {
              this.navCtrl.navigateRoot(['/home']);
            }, 2000);
          }
        });
      })
  }

}