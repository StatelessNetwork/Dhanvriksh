import { Component, OnInit, Optional } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AlertController, IonRouterOutlet, NavController, Platform, ToastController } from '@ionic/angular';
import { ThemeService } from './services/theme.service';
import { UtilService } from './services/util.service';
import { Location } from '@angular/common';
import { StorageService } from './services/storage.service';
import { applicationObject } from './model/applicationEnum';
import { loginUserDetails } from './model/common-model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { App } from '@capacitor/app';
import { BackgroundNotificationService } from './services/background-notification.service';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { LanguageService } from './services/language.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages: any[] = [];
  selectedIndex: any;
  loginUserData:loginUserDetails;
  tap = 0;
  resourceData: any[] = [];
  constructor(
    private theme: ThemeService,
    public util: UtilService,
    public platform: Platform,
    private navCtrl: NavController,
    private alertController: AlertController,
    private _storageService:StorageService,
    private _location:Location,
    private route:Router,
    private toastCtrl: ToastController,
    private _backNotification:BackgroundNotificationService,
    private _language:LanguageService,
    private router:Router,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
//this.initializeNotificationApp();
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
        title: 'Manage Committee',
        url: '/committee-tabs/committee-list',
        icn: 'person-outline',
        param: false,
        data: {}
      },
      {
        title: 'Manage Loan',
        url: '/loan-tabs/loan-list',
        icn: 'person-outline',
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
        icn: 'flag-outline',
        param: false
      },
      {
        title:  this.resourceKeyValue('Menu_lbl_privacy_policy'),
        url: '/privacy-policy',
        icn: 'help-circle-outline',
        param: false
      },
      {
        title: this.resourceKeyValue('Menu_lbl_terms_and_conditions'),
        url: '/terms-and-conditions',
        icn: 'help-circle-outline',
        param: false
      },
      {
        title: 'Delete Account',
        url: '/delete-account',
        icn: 'help-circle-outline',
        param: false
      },
    ];
    this.selectedIndex = 0;
    this.initializeApp();
    this.route.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
       var url = event.url;
      
       const selectedLanguage = localStorage.getItem('selectedLanguage');
       if (selectedLanguage != null && selectedLanguage && selectedLanguage != '' && selectedLanguage != 'null') {
         this.getDefaultSettingsById();
       } else {
         this.getDefaultSettings();
       }
   this.platform.ready().then(() => {
      
    this.platform.backButton.subscribeWithPriority(9999999, () => {
      if((url.indexOf('login')>0)==false   && (url.indexOf('dashboard')>0)==false){
        this._location.back();
      }
      else{
        if(Capacitor.getPlatform() == 'android') {
          if (!this.routerOutlet?.canGoBack()) {
            // double tap exit
            this.tap++;
            if(this.tap == 2) App.exitApp();
            else {
              this.doubleTapExitToast();
            }
        }
        }
      }
    });
        this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
          if(res) {
            this.loginUserData=res;
          }
        });
  });

    });  
  }
});  
   }

   initializeApp() {
      // Simulate a delay to show the splash screen for a few seconds
      setTimeout(() => {
        // Remove the splash screen after the app has initialized
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
          splashScreen.style.display = 'none';
        }
      }, 1000); // Splash screen duration (3 seconds)
  }

   ngOnInit() {
    this.platform.ready().then(() => {
      if (Capacitor.isNativePlatform()) {
        StatusBar.setOverlaysWebView({ overlay: true });
          StatusBar.setBackgroundColor({ color: 'transparent' });
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Dark })
      }
    });


    if(Capacitor.getPlatform() !== 'web') {
      ScreenOrientation.lock({
        orientation: 'portrait',
      }).catch((err) => {
      });
  
      this._backNotification.scheduleNotification();
      // this.getDeliveredNotifications();
    }
   }

 

   initializeNotificationApp() {
    this.platform.ready().then(() => {
      // Listen for notification click event
      this.listenToNotificationClick();
    });
  }

  listenToNotificationClick() {
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification clicked:', notification);

      // Example: Navigate to a specific page on notification click
      if (notification.notification.extra && notification.notification.extra.page) {
        this.router.navigate([notification.notification.extra.page]);
      } else {
        this.router.navigate(['/home']);  // Default to home if no specific page
      }
    });
  }

   resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

   async doubleTapExitToast() {
    let toast = await this.toastCtrl.create({
      message: 'Press back again to exit Dhanvriksh',
      duration: 3000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          side: 'start',
          icon: 'res://mipmap//dhanvriksh_icon', // Replace 'your-icon-name' with the name of the icon you want to use (e.g., 'heart', 'checkmark', etc.)
        }
      ]
    });
    toast.present();
    const dismiss = await toast.onDidDismiss();
    if(dismiss) {
      console.log('dismiss: ', dismiss);
      this.tap = 0;
    }
  }

  async presentAlertConfirm(title: any, body: any) {
    const alert = await this.alertController.create({
      header: this.util.translate('Notification'),
      subHeader: title,
      message: body,
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Okay'),
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  onPageChange(item: any, i: any) {
    this.selectedIndex = i;
      this.navCtrl.navigateRoot([item.url]);
  }

  updateFCMToken() {
    // const param = {
    //   id: localStorage.getItem('uid'),
    //   fcm_token: localStorage.getItem('pushToken') && localStorage.getItem('pushToken') != null ? localStorage.getItem('pushToken') : 'NA'
    // }
    // this.api.post('v1/profile/update', param).then((data: any) => {
    //   console.log(data);
    // }, error => {
    //   console.log(error);
    // }).catch(error => {
    //   console.log(error);
    // });
  }

  getProfileById() {
    const param = {
      id: localStorage.getItem('uid')
    };
    // this.api.post('v1/profile/byId', param).then((data: any) => {
    //   console.log(data);
    //   if (data && data.status == 200 && data.data) {
    //     if (data.data.status == 1) {
    //       this.util.loggedIN = true;
    //       this.util.userInfo = data.data;
    //     } else {
    //       localStorage.removeItem('uid');
    //       localStorage.removeItem('token');
    //     }
    //   }
    // }, error => {
    //   console.log(error);
    //   localStorage.removeItem('uid');
    //   localStorage.removeItem('token');
    //   this.util.userInfo = null;
    //   this.util.apiErrorHandler(error);
    // }).catch(error => {
    //   console.log(error);
    //   localStorage.removeItem('uid');
    //   localStorage.removeItem('token');
    //   this.util.userInfo = null;
    //   this.util.apiErrorHandler(error);
    // });
  }

  getDefaultSettings() {
    // this.api.get('v1/setttings/getDefaultSettings').then((data: any) => {
    //   console.log('default settings', data);
    //   if (data && data.status == 200 && data.success == true) {
    //     const lang = data && data.data && data.data.language ? data.data.language : null;
    //     if (lang && lang != null) {
    //       this.util.translations = JSON.parse(lang.content);
    //       localStorage.setItem('selectedLanguage', lang.id);
    //     }
    //     const general = data && data.data && data.data.general ? data.data.general : null;

    //     if (general && general != null) {
    //       this.util.general = general;
    //       this.cart.minOrderPrice = parseFloat(general.min);
    //       this.cart.shipping = general.shipping;
    //       this.cart.shippingPrice = parseFloat(general.shippingPrice);
    //       this.cart.orderTax = parseFloat(general.tax);
    //       this.cart.freeShipping = parseFloat(general.free);
    //       this.cart.delivery_area = parseFloat(general.delivery_area);
    //       console.log('general??', general, this.util.general);
    //     }
    //     const settings = data && data.data && data.data.settings ? data.data.settings : null;
    //     if (settings && settings != null) {
    //       this.util.settingInfo = settings;
    //       this.util.appLogo = settings.logo;
    //       this.util.direction = settings.appDirection;
    //       this.util.cside = settings.currencySide;
    //       this.util.currecny = settings.currencySymbol;
    //       this.util.show_booking = settings.show_booking == 1 ? true : false;
    //       this.util.app_status = settings.app_status == 1 ? true : false;
    //       this.util.app_closed_message = settings.app_status_message;
    //       this.util.home_style = settings && settings.home_page_style ? settings.home_page_style : 1;
    //       this.util.user_verification = settings.user_verify_with;
    //       this.util.user_login_with = settings.user_login;
    //       this.util.smsGateway = settings.sms_name;
    //       if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(settings.country_modal)) {
    //         this.util.countrys = JSON.parse(settings.country_modal);
    //       }
    //       this.util.default_country_code = settings && settings.default_country_code ? settings.default_country_code : '91';
    //       console.log(localStorage.getItem('theme'));
    //       this.util.app_color = settings.app_color;
    //       if (!localStorage.getItem('theme') || localStorage.getItem('theme') == null || localStorage.getItem('theme') == '') {
    //         this.theme.setTheme({
    //           primary: settings.app_color,
    //           secondary: '#0000FF',
    //         });
    //       } else if (localStorage.getItem('theme') == 'dark-theme') {
    //         this.theme.activeTheme(localStorage.getItem('theme'));
    //       } else {
    //         this.theme.setTheme({
    //           primary: settings.app_color,
    //           secondary: '#0000FF',
    //         });
    //       }

    //       document.documentElement.dir = this.util.direction;
    //     }

    //     const dining = data && data.data && data.data.dining ? data.data.dining : null;
    //     if (dining && dining != null) {
    //       this.util.diningInformations = dining;
    //     }

    //     const adminInfo = data && data.data && data.data.admin ? data.data.admin : null;
    //     if (adminInfo && adminInfo != null) {
    //       this.util.adminInfo = adminInfo;
    //     }

    //     this.cart.calcuate();

    //   }
    // }, error => {
    //   console.log(error);
    //   this.util.apiErrorHandler(error);
    // }).catch(error => {
    //   console.log(error);
    //   this.util.apiErrorHandler(error);
    // });
  }

  getDefaultSettingsById() {
    const param = {
      id: localStorage.getItem('selectedLanguage')
    }
    // this.api.post('v1/setttings/getAppSettingsByLanguageId', param).then((data: any) => {
    //   if (data && data.status == 200 && data.success == true) {
    //     const lang = data && data.data && data.data.language ? data.data.language : null;
    //     if (lang && lang != null) {
    //       this.util.translations = JSON.parse(lang.content);
    //     }
    //     const general = data && data.data && data.data.general ? data.data.general : null;

    //     if (general && general != null) {
    //       this.util.general = general;
    //       this.cart.minOrderPrice = parseFloat(general.min);
    //       this.cart.shipping = general.shipping;
    //       this.cart.shippingPrice = parseFloat(general.shippingPrice);
    //       this.cart.orderTax = parseFloat(general.tax);
    //       this.cart.freeShipping = parseFloat(general.free);
    //       this.cart.delivery_area = parseFloat(general.delivery_area);
    //       console.log('general??', general, this.util.general);
    //     }
    //     const settings = data && data.data && data.data.settings ? data.data.settings : null;
    //     if (settings && settings != null) {
    //       this.util.settingInfo = settings;
    //       this.util.appLogo = settings.logo;
    //       this.util.direction = settings.appDirection;
    //       this.util.cside = settings.currencySide;
    //       this.util.currecny = settings.currencySymbol;
    //       this.util.show_booking = settings.show_booking == 1 ? true : false;
    //       this.util.app_status = settings.app_status == 1 ? true : false;
    //       this.util.app_closed_message = settings.app_status_message;
    //       this.util.home_style = settings && settings.home_page_style ? settings.home_page_style : 1;
    //       this.util.user_verification = settings.user_verify_with;
    //       this.util.user_login_with = settings.user_login;
    //       this.util.smsGateway = settings.sms_name;
    //       if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(settings.country_modal)) {
    //         this.util.countrys = JSON.parse(settings.country_modal);
    //       }
    //       this.util.default_country_code = settings && settings.default_country_code ? settings.default_country_code : '91';
    //       console.log(localStorage.getItem('theme'));
    //       this.util.app_color = settings.app_color;
    //       if (!localStorage.getItem('theme') || localStorage.getItem('theme') == null || localStorage.getItem('theme') == '') {
    //         this.theme.setTheme({
    //           primary: settings.app_color,
    //           secondary: '#0000FF',
    //         });
    //       } else if (localStorage.getItem('theme') == 'dark-theme') {
    //         this.theme.activeTheme(localStorage.getItem('theme'));
    //       } else {
    //         this.theme.setTheme({
    //           primary: settings.app_color,
    //           secondary: '#0000FF',
    //         });
    //       }

    //       document.documentElement.dir = this.util.direction;
    //     }

    //     const dining = data && data.data && data.data.dining ? data.data.dining : null;
    //     if (dining && dining != null) {
    //       this.util.diningInformations = dining;
    //     }

    //     const adminInfo = data && data.data && data.data.admin ? data.data.admin : null;
    //     if (adminInfo && adminInfo != null) {
    //       this.util.adminInfo = adminInfo;
    //     }

    //     this.cart.calcuate();

    //   }
    // }, error => {
    //   console.log(error);
    //   this.util.apiErrorHandler(error);
    // }).catch(error => {
    //   console.log(error);
    //   this.util.apiErrorHandler(error);
    // });
  }

  getTranslate(str: any) {
    return this.util.translate(str);
  }

  getName() {
    return this.util && this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : '';
  }

  getAppName() {
    return this.util && this.util.appName && this.util.appName != null && this.util.appName != '' ? this.util.appName : 'Foodies';
  }

  getCover() {
    //return this.util && this.util.userInfo && this.util.userInfo.cover ? this.api.mediaURL + this.util.userInfo.cover : 'assets/delivery.png'
  }

  logout() {
      this._storageService.removeItem(applicationObject.loginUserDetails);
      this._storageService.removeItem(applicationObject.mobileDetails);
      this._storageService.removeItem(applicationObject.token);
      this.navCtrl.navigateRoot(['/login']);
  }

}

