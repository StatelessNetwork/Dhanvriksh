import { Component, OnInit } from '@angular/core';
import { userRegistrationModel } from '../model/userRegistration-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginUserDetails } from '../model/common-model';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UserRegistrationService } from '../services/user-registration.service';
import { TranslateService } from '@ngx-translate/core';
import { applicationObject, responseEnum } from '../model/applicationEnum';
import { NavController } from '@ionic/angular';
import { UtilService } from '../services/util.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userForm: FormGroup;
  countryList:any;
  objdata=new userRegistrationModel();
  loginUserData:loginUserDetails;
  resourceData:any;
  submitted = false;
  isLogin: boolean = false;

  constructor(private formBuilder: FormBuilder, private _commonService:CommonService,
    private _storgeService:StorageService, private route:Router,private _userRegistrationService:UserRegistrationService,
    private translate:TranslateService,public util: UtilService,
    private navCtrl: NavController,private _language:LanguageService) { 
      this._storgeService.get(applicationObject.token).then(data => {
        if(data){
          let currentDateTime:any= new Date().getTime();
          let expiryDateTime=new Date(data.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          {
            this._storgeService.get(applicationObject.resourceData).then((data: any) => {
              if (data) {
                this.resourceData=data;
              } 
            });
          }
          else{
            this.navCtrl.navigateRoot(['/login']);
          }
        }
        else{
          this.navCtrl.navigateRoot(['/login']);
        }
      });
    }

  ngOnInit() {
    this._storgeService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
      if(res) {
        this.loginUserData=res;
        this.bindCountryList();
        this.userForm = this.formBuilder.group({
          firstName: [this.loginUserData.firstName, Validators.required],
          lastName: [this.loginUserData.lastName, Validators.required],
          emailAddress: [this.loginUserData.emailAddress, [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
          address: [this.loginUserData.address, Validators.required],
          country: ['', Validators.required],
          gender: [this.loginUserData.gender, Validators.required],
          preferredlanguage: [this.loginUserData.preferredlanguage],
        });
      }
      else{
        this.route.navigate(['/login'])
      }
    });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }

  
  bindCountryList(){
    this._commonService.getDropdownList('countryList').subscribe(data=>{
      if(data){
        this.countryList=data;
        setTimeout(() => {
          this.userForm.patchValue({
            country:  this.loginUserData.countryId
          })
        }, 1000);
      }
    })
  }

  submitForm() {
    if (this.userForm.valid) {
      // Handle form submission here
        // Submit the form data here
        this.objdata.userId =this.loginUserData.encryptUserId ;
        this.objdata.firstName=this.userForm.value.firstName;
        this.objdata.lastName=this.userForm.value.lastName;
        this.objdata.emailAddress=this.userForm.value.emailAddress;
        this.objdata.address=this.userForm.value.address;
        this.objdata.country=this.userForm.value.country;
        this.objdata.gender =this.userForm.value.gender;
        this.objdata.preferredlanguage =this.userForm.value.preferredlanguage;
        this._storgeService.set(applicationObject.language,this.objdata.preferredlanguage);
        this.objdata.action ="updateUserDetails";
        this._userRegistrationService.saveUpdateUserRegistrationData(this.objdata).subscribe(data=>{
          if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
            this.translate.get("DatabaseMsg_user_details_updated_successfully").subscribe((keyResponse: string) => {
              this._commonService.successAlertMsg(keyResponse);
            });
          }
          else{
            if(data !=null && data.length>0 && data[0].errorNumber=="3"){
            this.translate.get("DatabaseMsg_email_address_already_registered").subscribe((keyResponse: string) => {
              this._commonService.errorAlertMsg(keyResponse);
            });
          }
          }
        })
    }
  }

}
