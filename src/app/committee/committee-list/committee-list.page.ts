import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { applicationObject } from 'src/app/model/applicationEnum';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-committee-list',
  templateUrl: './committee-list.page.html',
  styleUrls: ['./committee-list.page.scss'],
})
export class CommitteeListPage implements OnInit {
  tabs = ['Active', 'Completed'];
  selectedTabIndex = 0;
  resourceData:any;
  committeeList: any[];
  filteredcommitteeList: any[] = [];
  committeeCompletedList: any[];
  filteredCompletedcommitteeList: any[] = [];
  searchText = '';
  page = 0;
  perPage = 10;

  searchTextCompletedCommitee = '';
  pageCompletedCommitee = 0;
  perPageCompletedCommitee = 10;
  loginUserId:string;
  search = '';
  constructor(public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
    private navCtrl: NavController,
    private _committeeService:CommitteeService,
    private router:Router,
    public commonList: CommonService
  ) { 
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
        {
          this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
            if(res) {
              this.loginUserId=res.encryptUserId;
              this.getCommitteeList(res.encryptUserId);
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

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  getCommitteeList(loginUserId:string){
    this._committeeService.getCommitteeList(loginUserId).subscribe({
      next:(data)=>{
        if(data !=null && data.length > 0){
          if (data[0] && data[0].length > 0) {
            this.committeeList = JSON.parse(data[0]); // First array
          this.filteredcommitteeList = this.paginateArray();
          console.log(this.filteredcommitteeList)
          } else {
            this.committeeList = []; // or handle it appropriately if it's null or empty
            this.filteredcommitteeList=[];
          }
          this.tabs[0] = 'Active ('+this.filteredcommitteeList.length+')';

          if (data[1] && data[1].length > 0) {
            this.committeeCompletedList = JSON.parse(data[1]); // First arra
            this.filteredCompletedcommitteeList = this.paginateCompeltedCommitteeArray();
            console.log(this.filteredCompletedcommitteeList)
          } else {
            this.committeeCompletedList = []; // or handle it appropriately if it's null or empty
            this.filteredCompletedcommitteeList=[];
          }

          this.tabs[1] = 'Completed ('+this.filteredCompletedcommitteeList.length+')';

        }
    },
    error:(e)=>{
   
    },
    complete:()=>{
  
    }
  });

  }

  paginateArray() {
    this.page++;
    return this.committeeList.filter(
      x => x.committeeId > (this.page * this.perPage - this.perPage) && x.committeeId <= (this.page * this.perPage)
    );
  }

  loadMore(event) {
    setTimeout(() => {
      const array = this.paginateArray();
      this.filteredcommitteeList = this.filteredcommitteeList.concat(array);
      event.target.complete();
      if(array?.length < this.perPage) {
        event.target.disabled = true;
      };
    }, 1000);
  }


  paginateCompeltedCommitteeArray() {
    this.pageCompletedCommitee++;
    return this.committeeCompletedList.filter(
      x => x.committeeId > (this.pageCompletedCommitee * this.perPageCompletedCommitee - this.perPageCompletedCommitee) && x.committeeId <= (this.pageCompletedCommitee * this.perPageCompletedCommitee)
    );
  }

  loadMoreComplatedCommittee(event) {
    setTimeout(() => {
      const array = this.paginateCompeltedCommitteeArray();
      this.filteredCompletedcommitteeList = this.filteredCompletedcommitteeList.concat(array);
      event.target.complete();
      if(array?.length < this.perPageCompletedCommitee) {
        event.target.disabled = true;
      };
    }, 1000);
  }

  goToDetails(committeeData:any,page:string){
    if(page.toLowerCase()=="MemberList".toLowerCase())
      this.router.navigate(['/committee-mapping-member',{id: committeeData.EncyptcommitteeId, comtId: committeeData.holderName}]);
    else if(page.toLowerCase()=="ViewCommitteeBreakup".toLowerCase())
    this.router.navigate(['/committee-monthly-breakup',{id:committeeData.EncyptcommitteeId}]);
  }

  addNewCommittee(){
    this.router.navigate(['/add-new-committee']);
  }

  filterCommittee() {
    this.filteredcommitteeList = this.committeeList.filter((commit) =>
    commit.holderName.toLowerCase().includes(this.searchText.toLowerCase()) || 
    commit.startDate.toLowerCase().includes(this.searchText.toLowerCase()) || 
    commit.endDate.toLowerCase().includes(this.searchText.toLowerCase()) || 
    commit.statusName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  filterCompeletedCommittee() {
    this.filteredCompletedcommitteeList = this.committeeCompletedList.filter((commit) =>
    commit.holderName.toLowerCase().includes(this.searchTextCompletedCommitee.toLowerCase()) || 
    commit.startDate.toLowerCase().includes(this.searchTextCompletedCommitee.toLowerCase()) || 
    commit.endDate.toLowerCase().includes(this.searchTextCompletedCommitee.toLowerCase()) || 
    commit.statusName.toLowerCase().includes(this.searchTextCompletedCommitee.toLowerCase())
    );
  }

  goToDetail(item: any, from: any, index: any) {
    // var item = { ...item, from: from, index: index }
    // this.router.navigate(['/', 'committee-details', JSON.stringify(item)])
    this.router.navigate(['/committee-details',{id:item.EncyptcommitteeId}]);
  }

  goBack(){
    this.navCtrl.back();
  }

  getInitials(memberString: string): string[] {
    if (!memberString) return [];
    
    // Split the string by commas and trim whitespace
    return memberString.split(',').map(member => member.trim());
  }
  
 

}
