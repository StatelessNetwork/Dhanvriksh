import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilService } from '../services/util.service';;
import { ActivatedRoute, Router } from '@angular/router';
import * as intlTelInput from 'intl-tel-input';
import { VerifyPage } from '../verify/verify.page';
import { IonRouterOutlet, ModalController, NavController, Platform } from '@ionic/angular';
import { applicationObject, otpPageEnum } from '../model/applicationEnum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { mobileNumberOTPModel } from '../model/common-model';
import { LoginService } from '../services/login.service';
import { CommonService } from '../services/common.service';
import { LanguageService } from '../services/language.service';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

declare module 'intl-tel-input';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  screenWidth = window.innerWidth;
  keyboardShow: any;
  keyboardHeight: any;

  submitted = false;
  isLogin: boolean = false;
  @ViewChild('phoneNumberInput') phoneNumberInput: ElementRef;
  iti:any;
  isMobileNumberValidate:boolean=false;
  returnUrl:string;
  phoneNumberForm: FormGroup;
  objdata=new mobileNumberOTPModel();
  resourceData:any;
  constructor(public util: UtilService,
    private router: Router,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,private formBuilder: FormBuilder,
    private _storageService:StorageService,private navCtrl: NavController,
    private _loginService:LoginService,private _commonService:CommonService,
    public _language:LanguageService,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet) {
      if(this.route.snapshot.params!=null){
        if(this.route.snapshot.params['url']!=null)
        this.returnUrl=this.route.snapshot.params['url'];
      }

      this._storageService.get(applicationObject.resourceData).then((data: any) => {
        if (data) {
          this.resourceData=data;
        } 
      });
      
     }

  ngOnInit() {    
    this.phoneNumberForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required,Validators.minLength(10)]],
    });
 
    setTimeout(() => {      
         // Ensure the element is initialized before accessing it
    if (this.phoneNumberInput && this.phoneNumberInput.nativeElement) {
      // Access the native element safely
      this.initializePhoneNumberInput();
    } else {
      console.error('Phone number input element is not available.');
    }
    }, 1000);
  }


  initializePhoneNumberInput() {
    const phoneNumberElement = this.phoneNumberInput.nativeElement;
    this.iti = intlTelInput(phoneNumberElement, {
      initialCountry: 'IN', // Set the default country code to 'IN' (India) or your desired country code.
      separateDialCode: true, // Optionally separate the dial code.
    });

    this.iti.setCountry('IN');
  }

  resourceKeyValue(key:string){
  return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }



  onRegister(){
    this.navCtrl.navigateRoot(['/regsiter-by-mobile-number']);
  }

  loginWithPhoneOtpBtn(){
    this._storageService.removeItem(applicationObject.mobileDetails).then((remove) => { });   
    this._storageService.removeItem(applicationObject.token).then((remove) => { });   
    this._storageService.removeItem(applicationObject.loginUserDetails).then((remove) => { });  
    this.isLogin=true;
      if (this.phoneNumberForm.valid && !this.isMobileNumberValidate) {
        this._loginService.validateMobileNumber(this.phoneNumberForm.value.phoneNumber).subscribe({
          next:(data)=>{
            if(data !=null){
              //this._storageService.removeItem("mobileDetails");
              // Generate OTP logic here (e.g., generate a random 6-digit OTP)
              const otp = Math.floor(100000 + Math.random() * 900000);
              let objdetail:any={
                "mobileNumber":this.phoneNumberForm.value.phoneNumber,
                "otp":otp
              }
            this._storageService.set(applicationObject.mobileDetails,objdetail)
            //localStorage.setItem("mobileDetails",JSON.stringify(objdetail))
            this.objdata.mobileNumber=this.phoneNumberForm.value.phoneNumber;
            this.objdata.otp=otp;
            this.objdata.page=otpPageEnum.login;
              // Store OTP and mobileNumber in a service or storage for verification
              // For now, let's assume you have a service to store them
                this._commonService.saveMobileOTPData(this.objdata).subscribe(data=>{
                  if(data){
                    this.isLogin=false;
                    // Redirect to the verification page
                    this.navCtrl.navigateForward(['/verify'], { queryParams: { otp: this._commonService.encryptData(this.objdata.otp.toString()),m:this._commonService.encryptData(this.objdata.mobileNumber.toString()),p:this._commonService.encryptData(this.objdata.page.toString()),r:this.returnUrl!=null?this._commonService.encryptData(this.returnUrl):"" } });
                    //this.openVerificationModal(this.objdata.otp,this.objdata.mobileNumber,this.objdata.page,this.returnUrl);

                    }
                })
              }
              else{
                this.isMobileNumberValidate=true;
                this.isLogin=false;
              }
        },
        error:(e)=>{
          if(e.status==400){
            this.isMobileNumberValidate=true;
            this.isLogin=false;
          }
          else{
            this.isMobileNumberValidate=true;
            this.isLogin=false;
          }
        },
        complete:()=>{
          this.isLogin=false;
        }
      });
    }
  }

  async openVerificationModal(otp: any, mobileNumber: any,pageEnum: otpPageEnum,returnUrl:string) {
    const modal = await this.modalCtrl.create({
      component: VerifyPage,
      backdropDismiss: false,
      cssClass: 'custom-modal',
      componentProps: {
        'otp': otp,
        'mobileNumber': mobileNumber,
        'pageEnum': pageEnum,
        'returnUrl': returnUrl
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      this.isLogin=true;
      if (data && data.data && data.role && data.role.toString() == "1") {
        this.isLogin=false;
        if(this.returnUrl!=null)
          this.router.navigateByUrl(returnUrl);
        else 
          this.router.navigate(['/tabs/dashboard']);
      }
      else  if (data && data.data && data.role && data.role.toString() == "1") {
       this.util.errorToast('Something wrong. Please try again.')
      }
      this.isLogin=false;
    })
    return await modal.present();
  }


  validatePhoneNumber(){
    this.isMobileNumberValidate=false;
    if(this.phoneNumberForm.value.phoneNumber!=null && this.phoneNumberForm.value.phoneNumber.length>9){
    const isValid = this.iti.isValidNumber(); // Check if the entered number is valid for the selected country.
      if(!isValid)
      {
        this.isMobileNumberValidate=true;
      }
    }
 }

 ionViewDidEnter() {
  // Check if the app is running on a native platform
  if (Capacitor.isNativePlatform()) {
    Keyboard.addListener('keyboardDidShow', (info) => {
      this.keyboardShow = true;
      this.keyboardHeight = info.keyboardHeight;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.keyboardShow = false;
      this.keyboardHeight = 0;
    });
  }

  this.routerOutlet.swipeGesture = false;
}

ionViewWillLeave() {
  this.routerOutlet.swipeGesture = true;

  // Check if the app is running on a native platform
  if (Capacitor.isNativePlatform()) {
    Keyboard.removeAllListeners();
  }
}


}
