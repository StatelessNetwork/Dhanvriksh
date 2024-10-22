import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { applicationObject, responseEnum } from 'src/app/model/applicationEnum';
import { userRegistrationModel } from 'src/app/model/userRegistration-model';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-user-details',
  templateUrl: './add-user-details.page.html',
  styleUrls: ['./add-user-details.page.scss'],
})
export class AddUserDetailsPage implements OnInit {
  submitted = false;
  isLogin: boolean = false;
  userId:string;
  userForm: FormGroup;
  countryList:any;
  objdata=new userRegistrationModel();
  isTermCondition:boolean=false;
  resourceData:any;

  screenWidth = window.innerWidth;
  name = '';
  email = '';
  mobileNo = '';
  keyboardShow: any;
  keyboardHeight:any;
  constructor(
    public util: UtilService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _commonService:CommonService,
    private _userRegistrationService:UserRegistrationService,
    private _storageService:StorageService,
    private _language:LanguageService,
    public platform: Platform
  ) {
    this._storageService.get(applicationObject.resourceData).then((data: any) => {
      if (data) {
        this.resourceData=data;
      } 
    });
  }

  ngOnInit() {
    if(this.route.snapshot.params!=null){
      this.bindCountryList();
      this.userId= this.route.snapshot.params['id'];
      this.userForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        emailAddress: ['', [Validators.required, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)]],
        address: ['', Validators.required],
        country: ['TXYu0NjodAYzBODQlLqdmg==', Validators.required],
        gender: ['male', Validators.required]
      });
    }
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }

  bindCountryList(){
    this._commonService.getDropdownList('countryList').subscribe({
      next:(data)=>{
        if(data !=null){
          this.countryList=data;
        }
    },
    error:(e)=>{
      console.log(e)
    },
    complete:()=>{
    
    }
  });
}

  loginBack() {
    this.navCtrl.back();
  }

  submitForm() {

    if (this.userForm.valid) {
      this.isLogin=true;
      this._storageService.get(applicationObject.language).then((lang) => {
        if(lang!=null){
          this.objdata.preferredlanguage =lang;
        }
      })

        // Submit the form data here
        this.objdata.userId =this.userId ;
        this.objdata.firstName=this.userForm.value.firstName;
        this.objdata.lastName=this.userForm.value.lastName;
        this.objdata.emailAddress=this.userForm.value.emailAddress;
        this.objdata.address=this.userForm.value.address;
        this.objdata.country=this.userForm.value.country;
        this.objdata.gender =this.userForm.value.gender;
        this.objdata.action ="addUserDetails";

      //  this._commonService.showLoader();
        this._userRegistrationService.saveUpdateUserRegistrationData(this.objdata).subscribe({
          next:(data)=>{
            this.isLogin=false;
            if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
              this._commonService.successAlertMsg(this.resourceKeyValue("DatabaseMsg_user_details_updated_successfully"));
              this.resetForm();
              setTimeout(() => {
                  this.navCtrl.navigateRoot(['/login']);
                }, 2000);
            }
            else{
              this.isLogin=false;
              if(data !=null && data.length>0 && data[0].errorNumber=="2"){
                   this._commonService.errorAlertMsg(this.resourceKeyValue("DatabaseMsg_mobile_number_already_registered"));
              }
            }
          //  this._commonService.hideLoader();
        },
        error:(e)=>{
          this.isLogin=false;
       //   this._commonService.hideLoader();
        },
        complete:()=>{
          this.isLogin=false;
      //    this._commonService.hideLoader();
        }
      });

    }
  }

  resetForm() {
    this.userForm.reset();
  }


  onAccepTermCondition(){
    if(this.isTermCondition)
    this.isTermCondition=false;
    else
    this.isTermCondition=true;
  }

  back(){
    this.navCtrl.back();
  }

  
  selectedCountryName: string = 'India'; 
  onSelectCountry(encyptId: string) {
    this.userForm.get('country')?.setValue(encyptId); // Set the EncyptID in the form control

    // Find and set the selected country name
    const selectedCountry = this.countryList.find(country => country.EncyptID === encyptId);
    this.selectedCountryName = selectedCountry ? selectedCountry.Name : 'Select country';
console.log(this.countryList)
  }


  // Method to toggle terms acceptance
  toggleTerms() {
    this.isTermCondition = !this.isTermCondition;
    console.log('Terms accepted:', this.isTermCondition);
  }

  selectedGender: string = 'male'; // Track selected gender ('male' or 'female')

  // Method to select gender
  selectGender(gender: string) {
    this.userForm.get('gender')?.setValue(gender);
    this.selectedGender = gender;
    console.log('Selected Gender:', this.selectedGender);
    console.log(this.userForm.value)
  }
}
