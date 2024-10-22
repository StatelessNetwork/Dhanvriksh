import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { UtilService } from '../services/util.service';
import { ThemeService } from '../services/theme.service';
import { loginUserDetails } from '../model/common-model';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  name = '';
  email = '';
  mobile = '';
  height;
  currentTheme: any;
  authorized: boolean;
  showLogoutDialog=false;
  resourceData: any[] = [];
  public appPages: any[] = [];
  loginUserData:loginUserDetails;
  dex: any;
  selectedIndex: any;
  constructor(
    private plt: Platform,
    private router: Router,
    //public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    private theme: ThemeService,
    private _storageService:StorageService,
    private _language:LanguageService
  ) {
    console.log('Height: ' + plt.height());
    this.height = plt.height();
    this.currentTheme = localStorage.getItem('theme');

    this._storageService.get(applicationObject.resourceData).then((data: any) => {
      if (data) {
    this.resourceData=data;
    this.appPages = [
      {
        title: 'Home',
        url: '',
        icn: 'home-outline',
        param: false,
        data: {}
      },
      {
        title: 'Edit Profile',
        url: '/edit-profile',
        icn: 'person-outline',
        param: false,
        data: {}
      },
      {
        title: 'Language',
        url: '/languages',
        icn: 'language-outline',
        param: false
      },
      {
        title: this.resourceKeyValue('Menu_lbl_aboutUs'),
        url: '/about-us',
        icn: 'alert-circle-outline',
        param: false
      },
      {
        title: this.resourceKeyValue('Menu_lbl_faq'),
        url: '/faqs',
        icn: 'help-circle-outline',
        param: false
      },
      {
        title:  this.resourceKeyValue('Menu_lbl_privacy_policy'),
        url: '/privacy-policy',
        icn: 'warning-outline',
        param: false
      },
      {
        title: this.resourceKeyValue('Menu_lbl_terms_and_conditions'),
        url: '/terms-and-conditions',
        icn: 'reader-outline',
        param: false
      },
      {
        title: 'Delete Account',
        url: '/delete-account',
        icn: 'trash-bin-outline',
        param: false
      }
    ];

    this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
      if(res) {
        this.loginUserData=res;
      }
    });

  }
});  
  }

  getTranslate(str: any) {
    return this.util.translate(str);
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  onPageChange(item: any, i: any) {
    this.selectedIndex = i;
      this.navCtrl.navigateRoot([item.url]);
  }

  ionViewWillEnter() {
    this.authorized = localStorage.getItem('uid') && localStorage.getItem('token') &&
      localStorage.getItem('token') != null && localStorage.getItem('token') != 'null' && localStorage.getItem('token') != '' ? true : false;
    console.log('authorized?', this.authorized);
  }


  ngOnInit() {
  }

  orders() {
    this.navCtrl.navigateRoot(['/tabs/profile/orders']);
  }
  goToBooking() {
    this.navCtrl.navigateRoot(['/tabs/profile/bookings']);
  }

  goToAddress() {
    this.router.navigate(['address-list']);
  }

  reset() {
    this.router.navigate(['update-password']);
  }

  goToAbout() {
    this.navCtrl.navigateRoot('/pages/1/about');
  }

  goToContact() {
    this.router.navigate(['contact-form']);
  }

  goLangs() {
    this.router.navigate(['/languages']);
  }

  goToChats() {
    this.router.navigate(['chat-list']);
  }

  goFaqs() {
    this.router.navigate(['/pages/5/faqs']);
  }

  goHelp() {
    this.router.navigate(['/pages/6/help']);
  }

  openBookings() {
    this.navCtrl.navigateRoot(['/tabs/profile/bookings']);
  }

  login() {
    this.router.navigate(['login']);
  }
  logout() {
    this._storageService.removeItem(applicationObject.loginUserDetails);
    this._storageService.removeItem(applicationObject.mobileDetails);
    this._storageService.removeItem(applicationObject.token);
    this.navCtrl.navigateRoot(['/login']);
  }

  changeTheme() {
    console.log(localStorage.getItem('theme'));
    if (localStorage.getItem('theme') && localStorage.getItem('theme') == 'primary') {
      localStorage.setItem('theme', 'dark-theme');
    } else {
      this.theme.setTheme({
        primary: this.util.app_color,
        secondary: '#0000FF',
      });
      localStorage.setItem('theme', 'primary');
    }
    this.currentTheme = localStorage.getItem('theme');
    this.theme.activeTheme(localStorage.getItem('theme'));
  }

  profile() {
    this.router.navigate(['edit-profile']);
  }

  back(){
    this.navCtrl.back();
  }
}
