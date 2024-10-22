import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { LanguageService } from '../services/language.service';
import { UtilService } from '../services/util.service';
import { applicationObject, responseEnum } from '../model/applicationEnum';
import { loginUserDetails } from '../model/common-model';
import { userRegistrationModel } from '../model/userRegistration-model';
import { CommonService } from '../services/common.service';
import { UserRegistrationService } from '../services/user-registration.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {
  resourceData:any;
  deleteOption: string; // Variable to store the selected delete option
  deletionReason: string; // Variable to store the reason for deletion
  optionList:any;
  objdata=new userRegistrationModel();
  loginUserData:loginUserDetails;
  constructor(
    public util: UtilService,
    private _language:LanguageService,
    private _storgeService:StorageService,
    private navCtrl: NavController,
    private _commonService:CommonService,
    private _userRegistrationService:UserRegistrationService
  ) {
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

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  ngOnInit() {
    this._storgeService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
      if(res) {
        this.loginUserData=res;
        this.getOptionList();
      }
      else{
        this.navCtrl.navigateRoot(['/login']);
      }
    });
  }

  getOptionList(){
    this._commonService.getDropdownList('getDeleteOption').subscribe(data=>{
      if(data){
        this.optionList=data;
      }
    })
  }

  deleteAccount() {
    if (!this.deleteOption) {
        this.util.errorToast(this.resourceKeyValue('DeleteAccount_please_select_a_delete_option'))
      return;
    }
    if (!this.deletionReason) {
      this.util.errorToast(this.resourceKeyValue('DeleteAccount_please_enter_your_feedback'))
      return;
    }
      if(window.confirm(this.resourceKeyValue('DeleteAccount_are_you_sure_you_want_to_delte_your_account'))){
        this.objdata.userId =this.loginUserData.encryptUserId ;
        this.objdata.optionId=this.deleteOption;
        this.objdata.reason=this.deletionReason;
        this.objdata.action ="DeleteAccount";
        this._userRegistrationService.deleteAccount(this.objdata).subscribe(data=>{
          if(data !=null && data.length>0 && data[0].ErrorNumber==responseEnum.success){
            this.util.showToast(this.resourceKeyValue('DeleteAccount_msg_success'),"","");
              setTimeout(() => {
                this._storgeService.removeItem(applicationObject.loginUserDetails);
                this._storgeService.removeItem(applicationObject.mobileDetails);
                this._storgeService.removeItem(applicationObject.token);
                this.navCtrl.navigateRoot(['/login']);
              }, 2000);
          }
          else{
            this.util.errorToast(this.resourceKeyValue('DeleteAccount_msg_error'))
          }
        })
      }
  }

  goBack() {
    this.navCtrl.back();
  }

}
