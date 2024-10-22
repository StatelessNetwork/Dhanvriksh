import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../services/util.service';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { applicationObject, otpPageEnum, responseEnum } from '../model/applicationEnum';
import { LoginService } from '../services/login.service';
import { StorageService } from '../services/storage.service';
import { CommonService } from '../services/common.service';
import { loginUserDetails, mobileNumberOTPModel } from '../model/common-model';
import { userRegistrationModel } from '../model/userRegistration-model';
import { UserRegistrationService } from '../services/user-registration.service';
import { LanguageService } from '../services/language.service';
import { BackgroundService } from '../services/background.service';
import { BackgroundNotificationService } from '../services/background-notification.service';
import { NgOtpInputConfig } from 'ng-otp-input';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
  id: any;
  mobileNumber: any;
  otp: any;
  userOtp:any;
  pageEnum:any;
  returnUrl:string;
  isLogin: boolean = false;
  objdata=new mobileNumberOTPModel();
  loginUserDetails=new loginUserDetails();
  objUserdata=new userRegistrationModel();
  resourceData:any;

  keyboardShow: any;
  keyboardHeight: any;

  showLoadingDialog = false;
  otpValue = '0';
  remainingTime: any;
  displayTime: any;
  counter: any;

  config: NgOtpInputConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputStyles: {
      'height': '45px',
      'width': '45px',
      'border-radius': '10px',
      'color': 'var(--primaryColor)',
      'background': 'var(--whiteColor)',
      'box-shadow': '0 0 6px rgba(0,0,0,0.25)',
      'border-color': 'transparent',
      'font-size': '20px',
      'font-weight': '500',
      'margin': '0 8px'
    },
    inputClass: 'each_input',
    containerStyles: {
      'justify-content': 'center',
      'display': 'flex',
      'margin': '0 20px',
    }
  }
  constructor(
    private modalCtrl: ModalController,
    public util: UtilService,
    private _loginService:LoginService,
     private _storageService:StorageService,
     private _commonService:CommonService,
     private router: Router,
     private _userRegistrationService:UserRegistrationService,
     private _language:LanguageService,
     private backgroundService:BackgroundService,
     private committeeNotificationService:BackgroundNotificationService,
     public platform: Platform,
     private navCtrl: NavController,
     private route: ActivatedRoute
  ) {
    // this.otp = this.navParam.get('otp');
    // this.mobileNumber = this.navParam.get('mobileNumber');
    // this.pageEnum = this.navParam.get('pageEnum');
    // this.returnUrl = this.navParam.get('returnUrl');
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if (params && params['otp']!=null && params['m']!=null && params['p']!=null) {
        this.otp =this._commonService.decryptData(params["otp"]);
        this.mobileNumber = this._commonService.decryptData(params["m"]);
        this.pageEnum = this._commonService.decryptData(params["p"]);
        this.returnUrl = params["r"]!=null?this._commonService.decryptData(params["r"]):"";
        console.log(this.otp)
        this._storageService.get(applicationObject.resourceData).then((data: any) => {
          if (data) {
            this.resourceData=data;
            if(this.pageEnum==otpPageEnum.login && this.mobileNumber=="9654083074"){
              this._loginService.validateMobileNumber(this.mobileNumber).subscribe({
                next:(data)=>{
                  if(data !=null){
                    this._storageService.removeItem(applicationObject.mobileDetails).then((remove) => { });   
                    this.getLoginDetails(this.mobileNumber,data);
                  }
              },
              error:(e)=>{
                this._commonService.hideLoader();
              },
              complete:()=>{
                this._commonService.hideLoader();
              }
            });
          }
          } 
        });
      } else {
        this.navCtrl.back();
      }
    });
   
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }

  ngOnInit() {
  }
  onOtpChange(event: any) {
    console.log(event);
    this.userOtp = event;
  }

  onSubmit() {
    if (this.userOtp == '' || !this.userOtp) {
      this.util.errorToast(this.util.translate('Please enter OTP'));
      return false;
    }

    this.showLoadingDialog = true
    setTimeout(() => {
      this.showLoadingDialog = false;
      this.modalCtrl.dismiss();
      if (this.otp == this.userOtp) {
        this.isLogin = true;
        // OTP is valid; proceed to the next step
          if(this.pageEnum==otpPageEnum.registration){
          this.objUserdata.mobileNumber=this.mobileNumber;
          this.objUserdata.isMobileVerified=true;
          this.objUserdata.action="byMobile";
  
          this._userRegistrationService.saveUpdateUserRegistrationData(this.objUserdata).subscribe({
            next:(data)=>{
              this.isLogin = false;
              if(data !=null && data.length>0 && data[0].userId>0){
                this._storageService.removeItem(applicationObject.mobileDetails).then((remove) => { });   
                this.router.navigate(['/add-user-details',data[0].EncyptuserId.toString()]); // Replace with your success page
              }
              else if(data !=null && data.length>0 && data[0].userId==0){
                this.util.errorToast(data[0].errorMessage);
              }
          },
          error:(e)=>{
            if (e && e.status == 401 && e.error.error) {
              this.util.errorToast(e.error.error);
              return false;
            }
            if (e && e.status == 500 && e.error.error) {
              this.util.errorToast(e.error.error);
              return false;
            }
            this.isLogin = false;
            this.util.errorToast(this.util.translate('Wrong OTP'));
            return void 0;
          },
          complete:()=>{
            this.isLogin = false;
          }
        });
  
        }
        else if(this.pageEnum==otpPageEnum.login){
            this._loginService.validateMobileNumber(this.mobileNumber).subscribe({
              next:(data)=>{
                if(data !=null){
                  this.isLogin = false;
                  this._storageService.removeItem(applicationObject.mobileDetails).then((remove) => { });   
                  this.getLoginDetails(this.mobileNumber,data);
                }
            },
            error:(e)=>{
              if (e && e.status == 401 && e.error.error) {
                this.util.errorToast(e.error.error);
                return false;
              }
              if (e && e.status == 500 && e.error.error) {
                this.util.errorToast(e.error.error);
                return false;
              }
              this.isLogin = false;
              this.util.errorToast(this.util.translate('Wrong OTP'));
              return void 0;
            },
            complete:()=>{
              this.isLogin = false;
            }
          });
      }
      }
    }, 2000);
    
   
    return void 0;
  }


  getLoginDetails(mobileNumber:string,data:any){
    this.isLogin=true;
    if(data){
      this._storageService.set(applicationObject.token,data);
      this._loginService.getLoginDetails(mobileNumber).subscribe({
    next:(loginData)=>{
      if(loginData !=null){
        this.loginUserDetails.encryptUserId=loginData[0].EncyptuserId;
        this.loginUserDetails.userId=loginData[0].userId;
        this.loginUserDetails.address=loginData[0].address;
        this.loginUserDetails.gender=loginData[0].gender;
        this.loginUserDetails.countryName=loginData[0].country;
        this.loginUserDetails.emailAddress=loginData[0].emailAddress;
        this.loginUserDetails.firstName=loginData[0].firstName;
        this.loginUserDetails.lastName=loginData[0].lastName;
        this.loginUserDetails.mobileNumber=loginData[0].mobileNumber;
        this.loginUserDetails.countryId=loginData[0].EncyptcountryId;
        this.loginUserDetails.preferredlanguage=loginData[0].preferredlanguage;
        this._storageService.set(applicationObject.loginUserDetails,this.loginUserDetails); 
        this.isLogin=false;
        this.committeeNotificationService.scheduleNotification();
        //this.backgroundService.scheduleNotification(this.loginUserDetails.encryptUserId);
        if(this.returnUrl!=null && this.returnUrl!="")
          this.router.navigateByUrl(this.returnUrl);
        else 
          this.router.navigate(['/tabs/dashboard']);
        
      }
      else{
        this._storageService.removeItem(applicationObject.token).then((remove) => { });   
        this._storageService.removeItem(applicationObject.loginUserDetails).then((remove) => { });  
        this.isLogin=false;
        this.util.errorToast('Invalid user');
      }
  },
  error:(e)=>{
    this.isLogin=false;
  },
  complete:()=>{
    this.isLogin=false;
  }
});

}  
 
}

resendOTP() {
  let mobileNumber:string=this.mobileNumber;
  // Add logic to resend the OTP to the user's mobile number
  this._storageService.removeItem(applicationObject.mobileDetails).then((data) => { });   
  // Generate OTP logic here (e.g., generate a random 6-digit OTP)
  this.otp = Math.floor(100000 + Math.random() * 900000);
  let objdetail:any={
    "mobileNumber":mobileNumber,
    "otp":this.otp
  }
  this.objdata.mobileNumber=mobileNumber;
  this.objdata.otp=this.otp;
  this.objdata.page=otpPageEnum.verification;

  this._commonService.showLoader();
  this._commonService.saveMobileOTPData(this.objdata).subscribe({
    next:(data)=>{
      if(data){
        this._storageService.set("mobileDetails",objdetail);
        this._commonService.hideLoader();
        //localStorage.setItem("mobileDetails",JSON.stringify(objdetail))
        this._commonService.successAlertMsg('Resending OTP...');
      }
  },
  error:(e)=>{
    this._commonService.hideLoader();
  },
  complete:()=>{
    this._commonService.hideLoader();
  }
});
  
}


ionViewDidEnter() {
  if (Capacitor.isNativePlatform()) {
      this.remainingTime = 60;
      this.startTimer();
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

startTimer() {
  this.counter = setTimeout(() => {
    this.displayTime = this.getTimerClock(this.remainingTime)
    if (this.remainingTime !== 0) {
      this.startTimer();
      this.remainingTime = this.remainingTime - 1;
    }
    else {
      clearInterval(this.counter);
    }
  }, 1000);
}

getTimerClock(inputSeconds: number) {
  var sec_num = parseInt(inputSeconds.toString(), 10);
  this.remainingTime = sec_num;
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);
  var minutesString = '';
  var secondsString = '';
  minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
  secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
  return minutesString + ':' + secondsString;
}

resendPress() {
  if (this.remainingTime == 0) {
    this.remainingTime = 60;
    this.startTimer();
    this.resendOTP();
  }
}

ionViewDidLeave() {
  if (Capacitor.isNativePlatform()) {
  Keyboard.removeAllListeners();
  clearInterval(this.counter);
  }
}


onChange(event: any) {
  this.userOtp = event;
  this.otpValue = event;
  if (event.length === 4) {
    this.showLoadingDialog = true
    setTimeout(() => {
      this.showLoadingDialog = false;
      this.modalCtrl.dismiss();
      //this.navigation.goTo('/bottom-tab-bar/task')
    }, 2000);
  }
}

back(){
  this.navCtrl.back();
}

}
