import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController, NavController, MenuController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  isLoading = false;
  public translations: any[] = [];
  public default_country_code: any = '';
  public user_verification: any = 0;
  public user_login_with: any = 0;

  public themeColor = [
    { name: 'Default', class: 'default' },
    { name: 'Dark', class: 'dark-theme' },
  ];

  public userInfo: any;
  public general: any;

  public cside: any = 'left';
  public currecny: any = '$';
  public appName: any;

  public appLogo: any;
  public direction: any;

  public show_booking: boolean = true;
  public app_color: any;

  public app_status: boolean = true;
  public app_closed_message: any = '';
  private offerAdded = new Subject<any>();
  private newAddress = new Subject<any>();

  public settingInfo: any;

  public adminInfo: any;

  public diningInformations: any;
  orderStatus = [
    'Created',
    'Accepted',
    'Prepared',
    'Ongoing',
    'Delivered',
    'Pending Payments',
    'Cancelled',
    'Refunded',
    'Rejected'
  ];

  paidMethods = [
    'Index',
    'COD',
    'STRIPE',
    'PAYPAL',
    'PAYTM',
    'RAZORPAY',
    'INSTAMOJO',
    'PAYSTACK',
    'FLUTTERWAVE',
    'PAYKUN'
  ];
  private orderChange = new Subject<any>();
  public loggedIN: boolean = false;

  public home_style: any = 1;

  public countrys: any[] = [];

  public smsGateway: any = '0';
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private menuCtrl: MenuController
  ) {
    this.appName = environment.appName;
  }

  orderChanged() {
    this.orderChange.next(0);
  }

  retriveChanges(): Subject<any> {
    return this.orderChange;
  }

  onAddress() {
    this.newAddress.next(0);
  }

  getAddressSubscribe(): Subject<any> {
    return this.newAddress;
  }

  translate(str: any) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

  publishOffers() {
    this.offerAdded.next(0);
  }

  subscribeOffers(): Subject<any> {
    return this.offerAdded;
  };

  openMenu() {
    this.menuCtrl.open();
  }

  async show(msg?: any) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: this.translate(msg),
      spinner: 'bubbles',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async hide() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  async showWarningAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showSimpleAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: '',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showErrorAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async getEmailFilter(email: any) {
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(email))) {
      const alert = await this.alertCtrl.create({
        header: 'Warning',
        message: 'Please enter valid email',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    } else {
      return true;
    }
  }

  async showToast(msg: any, colors: any, positon: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: colors,
      position: positon
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async shoNotification(msg: any, colors: any, positon: any) {
    const toast = await this.toastCtrl.create({
      message: this.translate(msg),
      duration: 4000,
      color: colors,
      position: positon,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async errorToast(msg: any, color?: any) {
    const toast = await this.toastCtrl.create({
      message: this.translate(msg),
      duration: 2000,
      color: color ? color : 'dark'
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  apiErrorHandler(err: any) {
    if (err && err.status == 401 && err.error.error) {
      this.errorToast(err.error.error);
      this.navCtrl.navigateRoot('/login');
      return false;
    }
    if (err && err.status == 500 && err.error.error) {
      this.errorToast(err.error.error);
      return false;
    }
    if (err.status == -1) {
      this.errorToast('Failed To Connect With Server');
    } else if (err.status == 401) {
      this.errorToast('Unauthorized Request!');
      this.navCtrl.navigateRoot('/login');
    } else if (err.status == 500) {
      this.errorToast('Somethimg Went Wrong');
    } else if (err.status == 422 && err.error.error) {
      this.errorToast(err.error.error);
    } else {
      this.errorToast('Something went wrong');
    }
    return true;
  }

  makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
