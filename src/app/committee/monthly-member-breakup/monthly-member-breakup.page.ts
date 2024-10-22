import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { applicationObject, responseEnum } from 'src/app/model/applicationEnum';
import { monthlyMemberBreakupModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { MonthlyMemberPaymentUpdatePage } from '../monthly-member-payment-update/monthly-member-payment-update.page';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-monthly-member-breakup',
  templateUrl: './monthly-member-breakup.page.html',
  styleUrls: ['./monthly-member-breakup.page.scss'],
})
export class MonthlyMemberBreakupPage implements OnInit {

  resourceData:any;
  monthlyBreakupData:any;
  memberList:any;   
  objdata=new monthlyMemberBreakupModel();
  monthlyCommitBreakupId:string;
  isCreated:any=null;
  committeeId:string;
  loginUserData:loginUserDetails;
  selectedPaymentStatus: string = 'Pending'; 

  @ViewChild('taskSheet') taskSheet: any;

  tabs = ['Sub task', 'File', 'Team', 'Comments'];

  selectedTabIndex = 0;
  item: any;

  subTasks = [
    {
      id: '1',
      task: 'Collect data base from client',
      tasker: 'jenny Williamson',
      profession: 'Designer',
      image: '../../../assets/images/users/user2.png',
      isDone: true,
    },
    {
      id: '2',
      task: 'Get app resource from ui designer',
      tasker: 'jenny Williamson',
      profession: 'Flutter Developer',
      image: '../../../assets/images/users/user2.png',
      isDone: true,
    },
    {
      id: '3',
      task: 'Generate app play store resource',
      tasker: 'jenny Williamson',
      profession: 'Developer',
      image: '../../../assets/images/users/user2.png',
      isDone: false,
    },
    {
      id: '4',
      task: 'Set up API for apps',
      tasker: 'jenny Williamson',
      profession: 'Back-end developer',
      image: '../../../assets/images/users/user2.png',
      isDone: false,
    },
    {
      id: '5',
      task: 'Collect data from client',
      tasker: 'jenny Williamson',
      profession: 'Developer',
      image: '../../../assets/images/users/user2.png',
      isDone: false,
    },
  ];

  attachFilesList = [
    {
      id: 'f1',
      image: '../../../assets/images/files/file1.png',
      name: 'Lorem2.jpeg',
      size: '56.56 KB',
      date: '04 oct'
    },
    {
      id: 'f2',
      image: '../../../assets/images/files/file2.png',
      name: 'Lorem2.jpeg',
      size: '56.56 KB',
      date: '04 oct'
    },
    {
      id: 'f3',
      image: '../../../assets/images/files/file3.png',
      name: 'Lorem2.jpeg',
      size: '56.56 KB',
      date: '04 oct'
    },
  ];

  attachmentOptions = ['Copy link', 'Delete file', 'Share link'];

  commentsList = [
    {
      id: '1',
      image: '../../../assets/images/users/user2.png',
      name: 'Guy Hawkins',
      profession: 'Designer',
      time: '1 hour ago',
      comment: 'Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi'
    },
    {
      id: '2',
      image: '../../../assets/images/users/user3.png',
      name: 'Robert Fox',
      profession: 'Back-end developer',
      time: '1 hour ago',
      comment: 'Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi'
    },
    {
      id: '3',
      image: '../../../assets/images/users/user4.png',
      name: 'Guy Hawkins',
      profession: 'Flutter developer',
      time: '1 hour ago',
      attachments: [
        '../../../assets/images/files/file4.png',
        '../../../assets/images/files/file5.png',
        '../../../assets/images/files/file6.png',
      ],
      comment: 'Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id '
    },
    {
      id: '4',
      image: '../../../assets/images/users/user5.png',
      name: 'Esther Howard',
      profession: 'Developer',
      time: '1 hour ago',
      comment: 'Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi'
    },
    {
      id: '5',
      image: '../../../assets/images/users/user6.png',
      name: 'Albert Flores',
      profession: 'Designer',
      time: '1 hour ago',
      comment: 'Lorem ipsum dolor sit amet consectetudigni ssim lorem sed elementum sed. Ullamcorxcper ezcu id porttitor in. Consequat morbi odio morbi'
    },
  ];

  teamsList: any = [
    {
      id: '1',
      image: '../../../assets/images/users/user3.png',
      name: 'Jenny Wilson',
      profession: 'Designer',
    },
    {
      id: '2',
      image: '../../../assets/images/users/user2.png',
      name: 'Esther Howard',
      profession: 'Back-end developer',
    },
    {
      id: '3',
      image: '../../../assets/images/users/user4.png',
      name: 'Brooklyn Simmons',
      profession: 'Back-end developer',
    },
    {
      id: '4',
      image: '../../../assets/images/users/user5.png',
      name: 'Cameron Williamson',
      profession: 'flutter develpoer',
    }
  ];

  taskOptions = ['Delete task', 'Share task', 'Copy link'];

  comment = '';
  keyboardHeight: any;
  showDeleteDialog = false;
  showAddTaskSheet = false;
  taskName = '';
  subtaskMembers: any = [];

  memberMonthlyBreakupForm: FormGroup;
  paymentStatusList:any;
  selectedMemberForPayment:any;
  constructor(public util: UtilService,
    private _language:LanguageService,
    private _storageService:StorageService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private _committeeService:CommitteeService,
    private modalCtrl: ModalController,
    public popCtrl: PopoverController,
    private formBuilder: FormBuilder,
    private _commonService:CommonService,
    public platform: Platform) {
      this._storageService.get(applicationObject.token).then(data => {
        if(data){
          let currentDateTime:any= new Date().getTime();
          let expiryDateTime=new Date(data.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          {
            if(this.route.snapshot.params!=null){
              this.monthlyCommitBreakupId= this.route.snapshot.params['id'];
              this.isCreated= this.route.snapshot.params['isCreated'];
              console.log(this.isCreated)
              this.committeeId= this.route.snapshot.params['comId'];

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
                if(this.monthlyCommitBreakupId!=null && this.isCreated!=null && this.committeeId!=null)
                this.getMemberMonthkyBreakupData(this.monthlyCommitBreakupId);
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
    this.memberMonthlyBreakupForm = this.formBuilder.group({
      paymentStatus: ["TXYu0NjodAYzBODQlLqdmg=="],
      penaltyAmount:[0],
      remarks:[""]
    });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
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

  getMemberMonthkyBreakupData(monthlyCommitBreakupId:string){
    this._committeeService.getMemberBreakupListByIdData(monthlyCommitBreakupId,this.loginUserData.encryptUserId).subscribe({
      next:(data)=>{
        if(data !=null){
          this.monthlyBreakupData=data;
        }
    },
    error:(e)=>{
    
    },
    complete:()=>{
    
    }
  });
  }

    async changePaymentStatus(data:any) {
    const modal = await this.modalCtrl.create({
      component: MonthlyMemberPaymentUpdatePage,
      backdropDismiss: false,
      cssClass: 'custom-modal',
      componentProps: {
        'data': data
      }
    });
    modal.onDidDismiss().then((data) => {
      if (data !== null) {
            //this.modelData = modelData.data;
            this.getMemberMonthkyBreakupData(this.monthlyCommitBreakupId);
          }
    })
    return await modal.present();
  }

  openChangePaymentStatus(data:any){
    this.selectedMemberForPayment=data;
    this.popCtrl.dismiss();
    this.bindPaymentList();
    this.showAddTaskSheet=true;
    this.memberMonthlyBreakupForm.patchValue({
      paymentStatus:"TXYu0NjodAYzBODQlLqdmg==",
      penaltyAmount:0,
      remarks:""
    })
  }

  onSelectPayment(encyptId: string) {
    this.memberMonthlyBreakupForm.get('paymentStatus')?.setValue(encyptId); // Set the EncyptID in the form control

    // Find and set the selected country name
    const selectedPayment = this.paymentStatusList.find(pay => pay.EncyptID === encyptId);
    this.selectedPaymentStatus = selectedPayment ? selectedPayment.Name : 'Select Payment';
    console.log(this.memberMonthlyBreakupForm.value)
  }


  goToBack() {
    this.navCtrl.back();
  }

  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
    Keyboard.addListener('keyboardWillShow', info => {
      this.keyboardHeight = info.keyboardHeight;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.keyboardHeight = 0;
    });

    if (this.selectedTabIndex == 2) {
      // var newMembers = this.commonList.membersList.filter((item: any) => item.selected)
      // this.teamsList = [...this.teamsList, ...newMembers];
    }
  }
  }

  ionViewWillLeave() {
    if (Capacitor.isNativePlatform()) {
   // this.commonList.membersList.map((item: any) => item.selected = false)
    Keyboard.removeAllListeners()
    }
  }

  onSubmit():any{
    if (!this.memberMonthlyBreakupForm.valid) {
      return false;
    }
    this.showAddTaskSheet=false;
    this.taskSheet.dismiss();
      this.objdata.memberMonthlyBreakupId =this.selectedMemberForPayment.EncyptmemberMonthlyBreakupId ;
      this.objdata.paymentStatus=this.memberMonthlyBreakupForm.value.paymentStatus;
      this.objdata.penaltyAmount=parseFloat(this.memberMonthlyBreakupForm.value.penaltyAmount)
      this.objdata.remarks=this.memberMonthlyBreakupForm.value.remarks;
      this.objdata.userId= this.loginUserData.encryptUserId;
      this.objdata.action ="update";
      this._committeeService.updateMemberMonthlyBreakupDetails(this.objdata).subscribe({
      next:(data)=>{
        if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
          this.getMemberMonthkyBreakupData(this.monthlyCommitBreakupId);
          this.resetForm();
          this.util.showToast(data[0].errorMessage,"","");
        }
        else{
          this.util.errorToast(data[0].errorMessage);          
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
    this.memberMonthlyBreakupForm.patchValue({
      paymentStatus:"TXYu0NjodAYzBODQlLqdmg==",
      penaltyAmount:0,
      remarks:""
    })
    this.selectedMemberForPayment=[];
  }


}
