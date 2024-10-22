import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { applicationObject } from 'src/app/model/applicationEnum';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.page.html',
  styleUrls: ['./member-list.page.scss'],
})
export class MemberListPage implements OnInit {
  
  resourceData:any;
  memberList:any;
  filteredMembers: any[] = [];
  searchText = '';
  page = 0;
  perPage = 10;
  constructor(
    private navCtrl: NavController,
    public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
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
                res.encryptUserId;
                this.getMemberList(res.encryptUserId);
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

  addMember(){
    this.navCtrl.navigateRoot(['/add-member']);
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  getMemberList(loginUserId:string){
    this._commonService.showLoader();
    this._committeeService.getMemberList(loginUserId).subscribe({
      next:(data)=>{
        if(data){
          this.memberList=data;
          this.filteredMembers = this.paginateArray();
         // this.filteredMembers=this.memberList;
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

  goToDetails(memberId:string){
    this.router.navigate(['/mapped-committee-list',memberId]);
  }

  filterMembers() {
    this.filteredMembers = this.memberList.filter((member) =>
      member.firstName.toLowerCase().includes(this.searchText.toLowerCase()) || 
      member.lastName.toLowerCase().includes(this.searchText.toLowerCase()) || 
      member.mobileNumber.toLowerCase().includes(this.searchText.toLowerCase()) || 
      member.emailId.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  paginateArray() {
    this.page++;
    return this.memberList.filter(
      x => x.memberId > (this.page * this.perPage - this.perPage) && x.memberId <= (this.page * this.perPage)
    );
  }

  loadMore(event) {
    setTimeout(() => {
      const array = this.paginateArray();
      this.filteredMembers = this.filteredMembers.concat(array);
      event.target.complete();
      if(array?.length < this.perPage) {
        event.target.disabled = true;
      };
    }, 1000);
  }

  goToAddmember(){
    this.router.navigate(['/add-new-member']);
  }

  getBookingsByUid() {
    const param = {
      uid: localStorage.getItem('uid')
    }


  }



  goToBack() {
    this.navCtrl.back();
  }

  getTime(time: any) {
    return moment(time, ["h:mm A"]).format("hh:mm A");
  }


  getDate(date: any) {
    return moment(date).format('ll');
  }

}
