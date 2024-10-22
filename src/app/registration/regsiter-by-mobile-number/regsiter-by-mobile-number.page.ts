import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { ModalController, NavController,IonRouterOutlet } from '@ionic/angular';
import { Platform } from '@ionic/angular/common';
import * as intlTelInput from 'intl-tel-input';
import { applicationObject, otpPageEnum } from 'src/app/model/applicationEnum';
import { mobileNumberOTPModel } from 'src/app/model/common-model';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { VerifyPage } from 'src/app/verify/verify.page';

declare module 'intl-tel-input';

@Component({
  selector: 'app-regsiter-by-mobile-number',
  templateUrl: './regsiter-by-mobile-number.page.html',
  styleUrls: ['./regsiter-by-mobile-number.page.scss'],
})
export class RegsiterByMobileNumberPage implements OnInit {
  returnUrl:string;
  submitted = false;
  isLogin: boolean = false;
  @ViewChild('phoneNumberInput') phoneNumberInput: ElementRef;
  iti:any;
  isMobileNumberValidate:boolean=false;
  phoneNumberForm: FormGroup;
  objdata=new mobileNumberOTPModel();
  resourceData:any;

  screenWidth = window.innerWidth;
  keyboardShow: any;
  keyboardHeight: any;
  constructor(public util: UtilService,
    private router: Router,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private _storageService:StorageService,
    private _commonService:CommonService,
    private _language:LanguageService,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet) {
      this._storageService.get(applicationObject.resourceData).then((data: any) => {
        if (data) {
          this.resourceData=data;
        } 
      });
     }

     resourceKeyValue(key:string){
      return  this._language.filterAndGetValueByKey(this.resourceData,key);
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

  loginBack(){
    this.navCtrl.navigateRoot(['/login']);
  }

  onRegister(){
    this.isLogin=true;
    if (this.phoneNumberForm.valid && !this.isMobileNumberValidate) {
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
     this.objdata.page=otpPageEnum.registration;
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
      if (data && data.data.toString()=="1") {
        this.isLogin=false;
        this._storageService.removeItem(applicationObject.mobileDetails).then((remove) => { });   
        this.router.navigate(['/add-user-details',data.role.toString()]); // Replace with your success page
      }
      else  if (data && data.data.toString()=="2") {
       this.util.errorToast(data.role.toString())
      }
      this.isLogin=false;
    })
    return await modal.present();
  }


  validatePhoneNumber(){
    this.isMobileNumberValidate=false;
   //if(this.phoneNumberForm.value.phoneNumber!=null && this.phoneNumberForm.value.phoneNumber.length>8){
   const isValid = this.iti.isValidNumber(); // Check if the entered number is valid for the selected country.
   if(!isValid)
   {
     this.isMobileNumberValidate=true;
   }
 //}
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
