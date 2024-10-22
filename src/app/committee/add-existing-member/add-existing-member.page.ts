import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { applicationObject, responseEnum } from 'src/app/model/applicationEnum';
import { mappingOutPutModel, memberMappedWithCommitteeModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-existing-member',
  templateUrl: './add-existing-member.page.html',
  styleUrls: ['./add-existing-member.page.scss'],
})
export class AddExistingMemberPage implements OnInit {

  resourceData:any;
  committeeId:string;
  committeeList:any;
  totalAddedMemberCount:number=0;
  totalFailedMemberCount:number=0;
  committeeName:string;
  logindetails:loginUserDetails;
  memberList:any;
  filteredMembers: any[] = [];
  searchText = '';
  page = 0;
  perPage = 10;
  existingMemberForm: FormGroup;
  committeeDetails:any;
  selectAll: boolean = false;
  mappingOutPut:mappingOutPutModel[]=new Array();
  constructor(
    public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private _commonService:CommonService,
    private _committeeService:CommitteeService,
    private formBuilder: FormBuilder
  ) {
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
        {

          this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
            if(res) {
              this.logindetails=res;
              if(this.route.snapshot.params!=null){
                this.committeeId= this.route.snapshot.params['id'];
                this.committeeName=this.route.snapshot.params['comtId'];
                this.bindCommitteeList();
                 this.onCommitteeChange();
                    this._storageService.get(applicationObject.resourceData).then((data: any) => {
                      if (data) {
                        this.resourceData=data;
                      } 
                      else
                      this.resourceData=null;
                });
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
    this.existingMemberForm = this.formBuilder.group({
      committee: [this.committeeId],
    });
  }

  bindCommitteeList(){
    this._commonService.getDropdownList5('committeeList',"","","",this.logindetails.encryptUserId).subscribe(data=>{
      if(data){
        this.committeeList=data;

      }
    })
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  goToBack() {
    this.navCtrl.back();
  }

  onCommitteeChange(){
    this.existingMemberForm.patchValue({
      committee:this.committeeId
    })
    if(this.existingMemberForm.value.committee!=null)
      this.committeeId=this.existingMemberForm.value.committee;

      this._committeeService.getCommitteeByIdDetails(this.committeeId,this.logindetails.encryptUserId).subscribe({
      next:(data)=>{
        if(data){
          this.committeeDetails=data;
         this.getMemberListForMapping();
        }
    },
    error:(e)=>{
    
    },
    complete:()=>{
      
    }
  });
  }

  selectMember(event:any,member:any){
    for (let i = 0; i < this.filteredMembers.length; i++) {
      if (this.filteredMembers[i].EncyptmemberId === member.EncyptmemberId) {
        // Update the specific column in the selected row without using spread operator
        this.filteredMembers[i]['isSelected'] = event.detail.checked;
      }
    }

    if(this.filteredMembers.filter(x=>x.isSelected==false).length==0){
      this.selectAll=true;
    }
    else if(this.filteredMembers.filter(x=>x.isSelected==true).length>0){
      this.selectAll=false;
    }
  }
  
  addMemberWithCommittee(){
    let selectedMemberList:any=this.filteredMembers.filter(x=>x.isSelected==true);
    if(selectedMemberList.length>0){
      if(this.committeeDetails[0].totalSlotAvailable>= selectedMemberList.length){
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
        if(this.mappingOutPut.filter(x=>x.result==responseEnum.success).length==selectedMemberList.length){
          this.util.showToast(this.resourceKeyValue("DatabaseMsg_all_members_added_successfully"),"","bottom");
        }
        else{
          this.util.errorToast(this.resourceKeyValue("DatabaseMsg_some_member_failed_to_save"));
        }
        this.memberList=null;
        this.onCommitteeChange();
        this.getMemberListForMapping();
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

  getMemberListForMapping(){
    this._committeeService.getNotMappedMemberWithCommitteeList(this.committeeId,this.logindetails.encryptUserId).subscribe({
      next:(data)=>{
        if(data!=null){
          this.memberList=data;
          for(let i=0;i<this.memberList.length;i++){
            this.memberList[i].isSelected=false;
          }
          this.filteredMembers = this.memberList;
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

  
  toggleSelectAll() {
    this.filteredMembers.forEach(item => item.isSelected = this.selectAll);
  }

}
