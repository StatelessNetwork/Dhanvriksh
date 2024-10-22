import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { applicationObject, responseEnum } from 'src/app/model/applicationEnum';
import { monthlyMemberBreakupModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-monthly-member-payment-update',
  templateUrl: './monthly-member-payment-update.page.html',
  styleUrls: ['./monthly-member-payment-update.page.scss'],
})
export class MonthlyMemberPaymentUpdatePage implements OnInit {

  resourceData:any;
  memberMonthlyBreakupForm: FormGroup;
  data:any;
  paymentStatusList:any;
  objdata=new monthlyMemberBreakupModel();
  userId:string;
  constructor(private navParam: NavParams,
    private modalCtrl: ModalController,
    public util: UtilService,
    private formBuilder: FormBuilder,
     private _storageService:StorageService,
     private _language:LanguageService,
     private _commonService:CommonService,
     private _committeeService:CommitteeService,
     private navCtrl: NavController) {
      this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
        if(res) {
        this.userId=res.encryptUserId;
        this._storageService.get(applicationObject.resourceData).then((data: any) => {
          if (data) {
            this.data = this.navParam.get('data');
            this.resourceData=data;
            this.bindPaymentList();
          } 
          else
          this.resourceData=null;
        });
      }
        else{
          this.navCtrl.navigateRoot(['/login']);
        }
      });
   }

  ngOnInit() {
    this.memberMonthlyBreakupForm = this.formBuilder.group({
      paymentStatus: [this.data.EncyptpaymentStatusId],
      penaltyAmount:[""],
      remarks:[""]
    });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }

    close(data: any, status: any) {
      this.modalCtrl.dismiss(data, status);
    }

    bindPaymentList(){
      this._commonService.getDropdownList('committeePaymentStatus').subscribe({
        next:(data)=>{
          if(data){
            this.paymentStatusList=data;
          }
      },
      error:(e)=>{
      },
      complete:()=>{
      }
    });
    }

    onSubmit():any{
      if (!this.memberMonthlyBreakupForm.valid) {
        return false;
      }
        this.objdata.memberMonthlyBreakupId =this.data.EncyptmemberMonthlyBreakupId ;
        this.objdata.paymentStatus=this.memberMonthlyBreakupForm.value.paymentStatus;
        this.objdata.penaltyAmount=parseFloat(this.memberMonthlyBreakupForm.value.penaltyAmount)
        this.objdata.remarks=this.memberMonthlyBreakupForm.value.remarks;
        this.objdata.userId= this.userId;
        this.objdata.action ="update";
        this._committeeService.updateMemberMonthlyBreakupDetails(this.objdata).subscribe({
        next:(data)=>{
          if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
            this.resetForm();
            this.close(data[0].errorMessage,"")
            this.util.showToast(data[0].errorMessage,"","");
          }
          else{
            this.util.errorToast(data[0].errorMessage);
            this.close(data[0].errorMessage,"")
          }
      },
      error:(e)=>{
      },
      complete:()=>{
        
      }
    });
  
    }
  
    
  
    resetForm(){
      this.memberMonthlyBreakupForm.reset();
    }
  

}
