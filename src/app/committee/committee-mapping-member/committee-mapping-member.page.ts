import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { applicationObject, responseEnum } from 'src/app/model/applicationEnum';
import { mappingOutPutModel, memberMappedWithCommitteeModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-committee-mapping-member',
  templateUrl: './committee-mapping-member.page.html',
  styleUrls: ['./committee-mapping-member.page.scss'],
})
export class CommitteeMappingMemberPage implements OnInit {
  resourceData:any;
  filteredMembers: any[] = [];
  searchText = '';
  page = 0;
  perPage = 10;
  userId:string;
  memberMappedWithCommitteeList:any;  
  committeeName:string;
  totalMember:number=0;
  totalActiveMember:number=0;
  committeeId:string;

  info: any;
  search = '';

  committeeList:any;
  memberList:any;
  existingMemberForm: FormGroup;
  committeeDetails:any;
  totalAddedMemberCount:number=0;
  totalFailedMemberCount:number=0;
  logindetails:loginUserDetails;
  mappingOutPut:mappingOutPutModel[]=new Array();
  constructor(
    private navCtrl: NavController,
    public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
    public _commonService:CommonService,
    private _committeeService:CommitteeService,
    private router:Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
      this._storageService.get(applicationObject.token).then(data => {
        if(data){
          let currentDateTime:any= new Date().getTime();
          let expiryDateTime=new Date(data.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          {
            this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
              if(res) {
                this.logindetails=res;
                this.userId=res.encryptUserId;
                if(this.route.snapshot.params!=null){
                      this.committeeId= this.route.snapshot.params['id'];
                      this.committeeName=this.route.snapshot.params['comtId'];
                      if(this.committeeId!=null && this.committeeName!=null)
                      {
                      //this.MemberListMappingWithCommittee(this.committeeId,res.encryptUserId);
                      this.bindCommitteeDetailsById(res)
                      }
                      else
                      this.navCtrl.navigateRoot(['/login']);
                    }

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
    this.existingMemberForm = this.formBuilder.group({
      committee: [this.committeeId],
    });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }


  bindCommitteeDetailsById(logindetails:any){
    this.existingMemberForm.patchValue({
      committee:this.committeeId
    })
    if(this.existingMemberForm.value.committee!=null)
      this.committeeId=this.existingMemberForm.value.committee;

      this._committeeService.getCommitteeByIdDetails(this.committeeId,logindetails.encryptUserId).subscribe({
      next:(data)=>{
        if(data){
          this.committeeDetails=data[0];
          console.log(this.committeeDetails);
         this.getMemberListForMapping(logindetails);
        }
    },
    error:(e)=>{
    
    },
    complete:()=>{
      
    }
  });
  }

  getMemberListForMapping(loginDetails:any){
    this._committeeService.getNotMappedMemberWithCommitteeList(this.committeeId,loginDetails.encryptUserId).subscribe({
      next:(data)=>{
        if(data!=null){
          this.memberList=data;
          for(let i=0;i<this.memberList.length;i++){
            this.memberList[i].isSelected=false;
          }
          this.filteredMembers = this.paginateArray();
          console.log(this.filteredMembers)
        }
        
    },
    error:(e)=>{
      
    },
    complete:()=>{
      
    }
  });
  }

  filterMembers() {
    this.filteredMembers = this.memberList.filter((member) =>
      member.firstName.toLowerCase().includes(this.searchText.toLowerCase()) || 
      member.lastName.toLowerCase().includes(this.searchText.toLowerCase()) || 
      member.mobileNumber.toLowerCase().includes(this.searchText.toLowerCase()) || 
      member.emailId.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  // MemberListMappingWithCommittee(committeeId:string,loginUserId:string){
  //   this._commonService.showLoader();
  //   this._committeeService.getMemberListMappingWithCommitteeList(committeeId,loginUserId).subscribe({
  //     next:(data)=>{
  //       if(data!=null && data.length>0){
  //         this.memberMappedWithCommitteeList=data;
  //         this.committeeName=this.memberMappedWithCommitteeList[0].holderName;
  //         this.totalMember=this.memberMappedWithCommitteeList[0].totalMember;
  //         this.totalActiveMember=data.length;
  //         this.filteredMembers = this.paginateArray();
  //       }
  //       this._commonService.hideLoader();
  //   },
  //   error:(e)=>{
  //     this._commonService.hideLoader();
  //   },
  //   complete:()=>{
  //     this._commonService.hideLoader();
  //   }
  // });
  // }

  // goToDetails(memberId:string){
  //   this.router.navigate(['/mapped-committee-list',memberId]);
  // }

  // filterMembers() {
  //   this.filteredMembers = this.memberMappedWithCommitteeList.filter((member) =>
  //     member.MemberName.toLowerCase().includes(this.searchText.toLowerCase()) || 
  //     member.mobileNumber.toLowerCase().includes(this.searchText.toLowerCase()) || 
  //     member.emailId.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

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



  goToBack() {
    this.navCtrl.back();
  }

  addNewMember(){
    this.navCtrl.navigateRoot(['/add-member',{id:this.committeeId,comtId:this.committeeName}]);
    //this.router.navigate(['/add-member',{id:this.committeeId,comtId:this.committeeName}]);
  }

  addExistingMember(){
    this.router.navigate(['/add-existing-member',{id:this.committeeId,comtId:this.committeeName}]);
  }

  addMemberWithCommittee(){
    let selectedMemberList:any=this.filteredMembers.filter(x=>x.isSelected==true);
    if(selectedMemberList.length>0){
      if(this.committeeDetails.totalSlotAvailable>= selectedMemberList.length){
      for(let i=0;i<selectedMemberList.length;i++){
      let objdata=new memberMappedWithCommitteeModel();
      objdata.memberId =selectedMemberList[i].EncyptmemberId ;
      objdata.committeeId=this.existingMemberForm.value.committee;
      objdata.createdBy=this.logindetails.encryptUserId;
      objdata.action ="save";
      
      this._committeeService.saveUpdateMappingWithMember(objdata).subscribe(data=>{
        if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
          this.totalAddedMemberCount=this.totalAddedMemberCount+1;
          this.mappingOutPut.push({
            committeeId:this.existingMemberForm.value.committee,
            memberId:objdata.memberId,
            result:responseEnum.success,
            firstName:selectedMemberList[0].firstName,
            lastName:selectedMemberList[0].lastName,
            emailId:selectedMemberList[0].emailId,
            mobileNumber:selectedMemberList[0].mobileNumber
          })
        }
        else{
          this.totalFailedMemberCount=this.totalFailedMemberCount+1;
          this.mappingOutPut.push({
            committeeId:this.existingMemberForm.value.committee,
            memberId:objdata.memberId,
            result:responseEnum.fail,
            firstName:selectedMemberList[0].firstName,
            lastName:selectedMemberList[0].lastName,
            emailId:selectedMemberList[0].emailId,
            mobileNumber:selectedMemberList[0].mobileNumber
          })
        }
        if (this.mappingOutPut.filter(x => x.result == responseEnum.success).length == selectedMemberList.length) {
          this.util.showToast(this.resourceKeyValue("DatabaseMsg_all_members_added_successfully"), "", "bottom")
            .then(() => {
              this.navCtrl.back(); // Navigate back after the toast is shown
            });
        } else {
          this.util.errorToast(this.resourceKeyValue("DatabaseMsg_some_member_failed_to_save"))
            .then(() => {
              this.navCtrl.back(); // Navigate back after the error toast is shown
            });
        }
      })
     }
    }
    else{
      this.util.errorToast(this.resourceKeyValue("DatabaseMsg_you_selected") +" "+this.resourceKeyValue("DatabaseMsg_but_slot_available"));
    }
  }
    else{
      this.util.errorToast(this.resourceKeyValue("DatabaseMsg_please_select_at_least_one_member"));
    }
  }

  


}
