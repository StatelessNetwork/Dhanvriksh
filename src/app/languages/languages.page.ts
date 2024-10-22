import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { NavController, Platform } from '@ionic/angular';
import { applicationObject } from '../model/applicationEnum';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { LanguageService } from '../services/language.service';
import { CommonService } from '../services/common.service';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {
  dummy: any[] = [];
  list: any[] = [];
  selected: any="";
  keyboardShow: any;
  keyboardHeight: any;

  selectedLanguage: string = 'en'; // Set default language

  // List of languages with names and codes
  languages = [
    { name: 'English', code: 'en' },
    { name: 'Français', code: 'fr' },
    { name: 'عربى', code: 'ar' },
    { name: 'Española', code: 'es' },
    { name: 'Bahasa Indonesia', code: 'id' },
    { name: 'Português', code: 'pt' },
    { name: 'Türk', code: 'tr' },
    { name: 'Italiana', code: 'it' },
  ];
  constructor(
    public util: UtilService,
    private navCtrl: NavController,
    private router:Router,
    private _storageService:StorageService,
    private _language:LanguageService,
    private _commonService:CommonService,
    public platform: Platform
  ) {
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
        this.navCtrl.navigateRoot(['/tabs/dashboard']);
      }
      else{
        this._storageService.get(applicationObject.language).then((lang) => {
          if(lang!=null){
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  ngOnInit() {
    this.getLaguguages();
  }

  getLaguguages() {
    this.list = [];
    this.dummy = Array(5);
    this.list.push({name: 'English',id:'en',isSelected:true});
    this.list.push({name: 'Hindi',id:'hi',isSelected:false});
    this.dummy=[];
    this.selected="en"
  }

  goToBack() {
    this.navCtrl.back();
  }

  changed() {
    const item = this.list.filter(x => x.id == this.selected);
    if (item && item.length > 0) {
      this._commonService.showLoader();
      this._storageService.removeItem(applicationObject.resourceData)
      this._language.setLanguage(this.selected);
      this._storageService.set(applicationObject.language,this.selected);
      this._language.getResourceData().then((resourceData) => {
        this._commonService.hideLoader();
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        this._commonService.hideLoader();
        console.error('Error:', error);
      });

    }
  }

  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
        Keyboard.addListener('keyboardDidShow', info => {
          this.keyboardShow = true;
          this.keyboardHeight = info.keyboardHeight;
        });
  
        Keyboard.addListener('keyboardWillHide', () => {
          this.keyboardShow = false;
          this.keyboardHeight = 0;
        });
      }
  }

  ionViewDidLeave() {
    if (Capacitor.isNativePlatform()) {
    Keyboard.removeAllListeners();
    }
  }

  back(){
    this.navCtrl.back();
  }


}
