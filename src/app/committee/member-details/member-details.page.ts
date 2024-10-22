import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { applicationObject } from 'src/app/model/applicationEnum';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.page.html',
  styleUrls: ['./member-details.page.scss'],
})
export class MemberDetailsPage implements OnInit {

  resourceData:any;
  memberDetails:any;
  constructor(
    private navCtrl: NavController,
    public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
    private _commonService:CommonService,
    private router:Router,
    private route: ActivatedRoute,
    private _committeeService:CommitteeService
  ) {
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
        {
          this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
            if(res) {
              if(this.route.snapshot.params!=null && this.route.snapshot.params['length']!=undefined)
                {
                this.getMemberDetails(this.route.snapshot.params['id']);
                this._storageService.get(applicationObject.resourceData).then((data: any) => {
                  if (data) {
                    this.resourceData=data;
                  } 
                  else
                  this.resourceData=null;
                });
                }
                else
                this.router.navigate(['/member-list'])
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
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  getMemberDetails(memberId:string){

    this._commonService.showLoader();
    this._committeeService.getMemberById(memberId).subscribe({
      next:(data)=>{
        if(data){
          this.memberDetails=data;
         this._commonService.hideLoader();
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

  goToBack() {
    this.navCtrl.back();
  }

}
