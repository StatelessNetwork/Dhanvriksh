import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { applicationObject, responseEnum, statusEnum } from 'src/app/model/applicationEnum';
import { memberModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.page.html',
  styleUrls: ['./add-member.page.scss'],
})
export class AddMemberPage implements OnInit {

  resourceData:any;
  memberForm: FormGroup;
  countryList:any;
  cityList:any;
  stateList:any;
  objdata=new memberModel();
  committeeId:string;
  committeeDetails:any;
  committeeName:string;
  userId:string;
  constructor(
    public util: UtilService,
    private _storageService:StorageService,
    private _language:LanguageService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private _commonService:CommonService,
    private route: ActivatedRoute,
    private _committeeService:CommitteeService,
    private router:Router
  ) { 
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
          {
            if(this.route.snapshot.params!=null){
              this.committeeId= this.route.snapshot.params['id'];
              this.committeeName=this.route.snapshot.params['comtId'];

              this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
                if(res) {
                  this.userId=res.encryptUserId;
                  if(this.committeeId!=null && this.committeeName!=null)
                  this.getCommitteeByIdDetails(this.committeeId);
                  this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
                    if(res) {
                      this._storageService.get(applicationObject.resourceData).then((data: any) => {
                        if (data) {
                          this.resourceData=data;
                        } 
                        else
                        this.resourceData=null;
                      });
                    }
                  });
                }
              });

            }
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
    this.bindCountryList();

    this.memberForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern('[0-9]*')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      country: ['', Validators.required],
      state: [''],
      city: [''],
      pincode: [''],
    });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  onSubmit() {
    if (this.memberForm.valid) {
      // Submit the form data here
      this.objdata.memberId =0 ;
      this.objdata.firstName=this.memberForm.value.firstName;
      this.objdata.committeeId=this.committeeId
      this.objdata.lastName=this.memberForm.value.lastName;
      this.objdata.mobileNumber=this.memberForm.value.mobileNumber;
      this.objdata.emailId=this.memberForm.value.email;
      this.objdata.address =this.memberForm.value.address;
      this.objdata.countryId=this.memberForm.value.country;
      this.objdata.stateId =this.memberForm.value.state;
      this.objdata.cityId=this.memberForm.value.city;
      this.objdata.pincode =this.memberForm.value.pincode;
      this.objdata.status =statusEnum.Active;
      this.objdata.createdBy=this.userId;
      this.objdata.action ="save";
      this._committeeService.saveUpdateCommitteeMember(this.objdata).subscribe(data=>{
        if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
            this.resetForm();
            this.util.showToast(this.resourceKeyValue("DatabaseMsg_member_name_already_exists"),"","bottom");
          if(this.committeeDetails!=undefined && this.committeeDetails!=null)
          this.router.navigate(['/committee-mapping-member',this.committeeId]);
          else
          this.router.navigate(['/member-list']);
          
        }
        else{
          if(data!=null && data[0].errorNumber=="2")
            this.util.errorToast(this.resourceKeyValue("DatabaseMsg_member_name_already_exists"));
          else if(data!=null && data[0].errorNumber=="3")
            this.util.errorToast(this.resourceKeyValue("DatabaseMsg_mobile_number_already_register_with_other_member"));
          else if(data!=null && data[0].errorNumber=="4")
            this.util.errorToast(this.resourceKeyValue("DatabaseMsg_email_address_already_register_with_other_member"));
        }
      })
    }
  }

  resetForm(){
    this.memberForm.reset();
  }

  bindCountryList(){
    this._commonService.getDropdownList('countryList').subscribe(data=>{
      if(data){
        this.countryList=data;
      }
    })
  }

  bindStateListByCountryId(countryId:string){
    this._commonService.getDropdownList5('stateList',"","","",countryId).subscribe(data=>{
      if(data){
        this.stateList=data;
      }
    })
  }

  bindCityListByStateId(stateId:string){
    this._commonService.getDropdownList5('cityList',"","","",stateId).subscribe(data=>{
      if(data){
        this.cityList=data;
      }
    })
  }

  onCountryChange() {
    this.bindStateListByCountryId(this.memberForm.value.country);
    console.log(this.memberForm.value.country)
  }

  onStateChange() {
    this.bindCityListByStateId(this.memberForm.value.state);
    console.log(this.memberForm.value.state)
  }

  getCommitteeByIdDetails(committeeId:string){
    this._committeeService.getCommitteeByIdDetails(committeeId,this.userId).subscribe(data=>{
      if(data){
        this.committeeDetails=data;
       console.log(data)
      }
    })
  }

  goToBack() {
    this.navCtrl.back();
  }


}
