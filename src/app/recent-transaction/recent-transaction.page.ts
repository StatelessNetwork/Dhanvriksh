import { Component, OnInit } from '@angular/core';
import { loginUserDetails } from '../model/common-model';
import { UtilService } from '../services/util.service';
import { CommonService } from '../services/common.service';
import { StorageService } from '../services/storage.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { applicationObject } from '../model/applicationEnum';

@Component({
  selector: 'app-recent-transaction',
  templateUrl: './recent-transaction.page.html',
  styleUrls: ['./recent-transaction.page.scss'],
})
export class RecentTransactionPage implements OnInit {
  resourceData: any[] = [];
  loginUserData:loginUserDetails;
  notificationrecentData:any;
  constructor(public util: UtilService,
    private _commonService:CommonService,
    private _storageService:StorageService,
    private navCtrl: NavController,
    private router:Router
  ) { 
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
        {
          this._storageService.get(applicationObject.resourceData).then((data: any) => {
            if (data) {
              this.resourceData=data;
              this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
                if(res) {
                  this.loginUserData=res;
                  console.log(this.loginUserData)
                  this.GetDashboardRecentNotification(res.encryptUserId)
                }
              });
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

  GetDashboardRecentNotification(userId:string){
    this._commonService.GetDashboardRecentNotification(userId).subscribe({
      next:(data)=>{
        if (data != null && data.length > 0) {
          this.notificationrecentData = data;
        } else {
          this.notificationrecentData = [];
        }
        console.log(this.notificationrecentData)
    },
    error:(e)=>{
      console.log(e)
    },
    complete:()=>{
      
    }
  });
}

redirectToRecentNotificationPage(type:string,Id:string){
  if(type.toLowerCase()=='committee'){
    this.router.navigate(['/committee-monthly-breakup',Id]);
  }
  else if(type.toLowerCase()=='loan'){
    this.navCtrl.navigateForward(['/loan-detail-by-id'], { queryParams: { loanId: Id } });
  }
}

goToBack() {
  this.navCtrl.back();
}

}
