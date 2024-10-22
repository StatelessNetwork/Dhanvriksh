import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { applicationObject } from 'src/app/model/applicationEnum';
import { monthlyMemberBreakupModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-committee-monthly-breakup',
  templateUrl: './committee-monthly-breakup.page.html',
  styleUrls: ['./committee-monthly-breakup.page.scss'],
})
export class CommitteeMonthlyBreakupPage implements OnInit {
  resourceData:any;
  monthlyBreakupList:any;
  committeeId:string;
  loginUserData:loginUserDetails;

  constructor(public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router:Router,
    private _committeeService:CommitteeService) { 
      this._storageService.get(applicationObject.token).then(data => {
        if(data){
          let currentDateTime:any= new Date().getTime();
          let expiryDateTime=new Date(data.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          {
            if(this.route.snapshot.params!=null){
              this.committeeId= this.route.snapshot.params['id'];
              this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
                if(res) {
                this.loginUserData=res;
                this._storageService.get(applicationObject.resourceData).then((data: any) => {
                  if (data) {
                    this.resourceData=data;
                  } 
                  else
                  this.resourceData=null;
                });

                if(this.committeeId!=null)
                this.getCommitteeMonthlyBreakupList(this.committeeId,this.loginUserData);
                else
                this.navCtrl.navigateRoot(['/committee-list']);
                }
                else{
                  this.navCtrl.navigateRoot(['/login']);
                }
              });

            }
            else{
              this.navCtrl.navigateRoot(['/committee-list']);
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
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  getCommitteeMonthlyBreakupList(committeeId:string,loginUserData:loginUserDetails){
    this._committeeService.getCommitteeMonthlyBreakupList(committeeId,loginUserData.encryptUserId).subscribe({
      next:(data)=>{
        if(data){
          this.monthlyBreakupList=data;
        }
      
    },
    error:(e)=>{
  
    },
    complete:()=>{
    
    }
  });

  }

  goToMonthlyDrawnUpdate(EncyptmonthlyCommitBreakupId:string,createdBy:string){
    this.router.navigate(['/monthly-committee-drawn-update',{id:EncyptmonthlyCommitBreakupId,isCreated:createdBy,comId:this.committeeId}]);
  }

  redirectToMemberBreakup(EncyptmonthlyCommitBreakupId:string,createdBy:string){
    this.router.navigate(['/monthly-member-breakup',{id:EncyptmonthlyCommitBreakupId,isCreated:createdBy,comId:this.committeeId }]);
  }

  goToBack() {
    this.navCtrl.back();
  }


}
