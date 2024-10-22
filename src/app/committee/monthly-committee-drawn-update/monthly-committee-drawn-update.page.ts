import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { applicationObject, responseEnum } from 'src/app/model/applicationEnum';
import { committeeMonthlyBreakupModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-monthly-committee-drawn-update',
  templateUrl: './monthly-committee-drawn-update.page.html',
  styleUrls: ['./monthly-committee-drawn-update.page.scss'],
})
export class MonthlyCommitteeDrawnUpdatePage implements OnInit {
  resourceData:any;
  monthlyBreakupData:any;
  memberList:any;   
  monthlyDrawnMemberForm: FormGroup;
  objdata=new committeeMonthlyBreakupModel();
  monthlyCommitBreakupId:string;
  isCreated:number=null;
  committeeId:string;
  userId:string;

  constructor(public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _commonService:CommonService,
    private _committeeService:CommitteeService,
    private router:Router) {
      this._storageService.get(applicationObject.token).then(data => {
        if(data){
          let currentDateTime:any= new Date().getTime();
          let expiryDateTime=new Date(data.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          {
            this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
              if(res) {
                this.userId=res.encryptUserId;
                this._storageService.get(applicationObject.resourceData).then((data: any) => {
                  if (data) {
                    this.resourceData=data;
                  } 
                });
                if(this.route.snapshot.params!=null){
                  this.monthlyCommitBreakupId= this.route.snapshot.params['id'];
                  this.isCreated= this.route.snapshot.params['isCreated'];
                  this.committeeId= this.route.snapshot.params['comId'];
                  if(this.monthlyCommitBreakupId!=null && this.isCreated!=null && this.committeeId!=null)
                  this.getMonthlyBreakupData(this.monthlyCommitBreakupId);
                  else
                  this.navCtrl.navigateRoot(['/committee-list']);
                }
                else{
                  this.navCtrl.navigateRoot(['/committee-list']);
                }
              }
              else{
                this.navCtrl.navigateRoot(['/login']);
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
    this.monthlyDrawnMemberForm = this.formBuilder.group({
      member: ["", Validators.required],
      lossamount:["", Validators.required],
      remarks:[""]
    });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  bindMemberList(committeeId:string){
    
    this._commonService.getDropdownList5('mappedMemberList',"","",this.userId,committeeId).subscribe({
      next:(data)=>{
        if(data){
          this.memberList=data;
          console.log(this.memberList)
        }
      
    },
    error:(e)=>{
    
    },
    complete:()=>{
    
    }
  });

  }

  getMonthlyBreakupData(monthlyCommitBreakupId:string){
    
    this._committeeService.getMonthlyBreakupByIdData(monthlyCommitBreakupId,this.userId).subscribe({
      next:(data)=>{
        if(data){
          this.bindMemberList(data[0].EncyptcommitteeId);
          this.monthlyBreakupData=data;
        }
      
    },
    error:(e)=>{
    
    },
    complete:()=>{
    
    }
  });
  }

  onSubmit():any{
    if (!this.monthlyDrawnMemberForm.valid) {
      return false;
    }
      this.objdata.monthlyCommitBreakupId =this.monthlyCommitBreakupId ;
      this.objdata.committeeId =this.monthlyBreakupData[0].EncyptcommitteeId;
      this.objdata.monthlyCommitteeOwnerId =this.monthlyDrawnMemberForm.value.member ;
      this.objdata.lossAmount =this.monthlyDrawnMemberForm.value.lossamount ;
      this.objdata.remarks =this.monthlyDrawnMemberForm.value.remarks ;
      this.objdata.userId=this.userId;
      this.objdata.action ="save";
      
      this._committeeService.updateCommitteeMonthlyBreakupDetails(this.objdata).subscribe({
      next:(data)=>{
        if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
          this.util.showToast(this.resourceKeyValue("DatabaseMsg_drwan_status_updated_successfully"),"","")
            this.resetForm();
            this.router.navigate(['/committee-monthly-breakup',{id:this.monthlyBreakupData[0].EncyptcommitteeId}])
        }
        else{
          this.util.errorToast(this.resourceKeyValue("DatabaseMsg_problem_perofmance_issue"));
        }
      
    },
    error:(e)=>{
    
    },
    complete:()=>{
    
    }
  });
  }

  resetForm(){
    this.monthlyDrawnMemberForm.reset();
  }

  goToBack() {
    this.navCtrl.back();
  }

}
