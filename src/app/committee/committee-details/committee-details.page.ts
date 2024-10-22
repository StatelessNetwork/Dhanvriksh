import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { NavController, Platform, PopoverController } from '@ionic/angular';
import { applicationObject } from 'src/app/model/applicationEnum';
import { loginUserDetails } from 'src/app/model/common-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-committee-details',
  templateUrl: './committee-details.page.html',
  styleUrls: ['./committee-details.page.scss'],
})
export class CommitteeDetailsPage implements OnInit {
  @ViewChild('taskSheet') taskSheet: any;
  selectedTabIndex = 0;
  item: any;

  allTasks: any = [
    {
      id: 't1',
      title: 'Mobile application  design',
      description: 'Shopping app project',
      progress: 0.6,
      fill: 'var(--woodenColor)',
      unfill: 'var(--lightWoodenColor)',
    },
    {
      id: 't2',
      title: 'UX member payment',
      description: 'Microsoft product  design',
      progress: 0.5,
      fill: 'var(--parrotColor)',
      unfill: 'var(--lightParrotColor)',
    },
    {
      id: 't3',
      title: 'Email reply & testing',
      description: 'Green project',
      progress: 0.2,
      fill: 'var(--tomatoColor)',
      unfill: 'var(--lightTomatoColor)',
    },
    {
      id: 't4',
      title: 'Deshboard ui design',
      description: 'Shopping app project',
      progress: 0.6,
      fill: 'var(--blueColor)',
      unfill: 'var(--lightBlueColor)',
    },
    {
      id: 't5',
      title: 'User interface design',
      description: 'Food delivery app project',
      progress: 0.4,
      fill: 'var(--yellowColor)',
      unfill: 'var(--lightYellowColor)',
    },
    {
      id: 't6',
      title: 'Mobile application design',
      description: 'Shopping app project',
      progress: 0.6,
      fill: 'var(--woodenColor)',
      unfill: 'var(--lightWoodenColor)',
    },
    {
      id: 't7',
      title: 'UX member payment',
      description: 'Microsoft product  design',
      progress: 0.5,
      fill: 'var(--parrotColor)',
      unfill: 'var(--lightParrotColor)',
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

  projectOptions = ['Delete project', 'Share project', 'Copy link'];

  taskOptions = ['Delete task', 'Share task', 'Copy link'];

  showTaskDeleteDialog = false;
  comment = '';
  keyboardHeight: any;
  showDeleteDialog = false;
  showAddTaskSheet = false;
  selectedTaskIndex: any;
  monthlyBreakupList:any=[];
  committeeId:string;
  loginUserData:loginUserDetails;
  resourceData:any;
  memberMappedWithCommitteeList:any;
  tabs = ['Committee Monthly Breakup', 'Member Mapped'];
  
  constructor(public router: Router, public commonList: CommonService, public platform: Platform, 
    public popCtrl: PopoverController, private route: ActivatedRoute,private _committeeService:CommitteeService,
    private _language:LanguageService,private _storageService:StorageService,private navCtrl: NavController,
    public util: UtilService) {
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
              {
                this.getCommitteeMonthlyBreakupList(this.committeeId,this.loginUserData);
                this.MemberListMappingWithCommittee(this.committeeId,this.loginUserData.encryptUserId);
              }
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
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('item')) {
        this.item = JSON.parse(`${paramMap.get('item')}`);
      }
    });
  }

  getCommitteeMonthlyBreakupList(committeeId:string,loginUserData:loginUserDetails){
    this._committeeService.getCommitteeMonthlyBreakupList(committeeId,loginUserData.encryptUserId).subscribe({
      next:(data)=>{
        if(data){
          this.monthlyBreakupList=data;
          console.log(this.monthlyBreakupList)
        }
      
    },
    error:(e)=>{
  
    },
    complete:()=>{
    
    }
  });

  }

  MemberListMappingWithCommittee(committeeId:string,loginUserId:string){
    this.commonList.showLoader();
    this._committeeService.getMemberListMappingWithCommitteeList(committeeId,loginUserId).subscribe({
      next:(data)=>{
        if(data!=null && data.length>0){
          this.memberMappedWithCommitteeList=data;
          console.log(this.memberMappedWithCommitteeList)
          // this.committeeName=this.memberMappedWithCommitteeList[0].holderName;
          // this.totalMember=this.memberMappedWithCommitteeList[0].totalMember;
          // this.totalActiveMember=data.length;
          // this.filteredMembers = this.paginateArray();
        }
        this.commonList.hideLoader();
    },
    error:(e)=>{
      this.commonList.hideLoader();
    },
    complete:()=>{
      this.commonList.hideLoader();
    }
  });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  redirectToMemberBreakup(item:any){
    this.router.navigate(['/monthly-member-breakup',{id:item.EncyptmonthlyCommitBreakupId,isCreated:item.EncyptcreatedBy,comId:item.EncyptcommitteeId }]);
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
      var newMembers = this.commonList.membersList.filter((item: any) => item.selected)
      this.teamsList = [...this.teamsList, ...newMembers];
    }
  }
  }

  ionViewWillLeave() {
    if (Capacitor.isNativePlatform()) {
    this.commonList.membersList.map((item: any) => item.selected = false)
    Keyboard.removeAllListeners()
    }
  }

  deletePress() {
    // this.item.from == 'active'
    //   ?
    //   this.commonList.deleteActiveProject(this.item.index)
    //   :
    //   this.commonList.deleteCompleteProject(this.item.index)
    // this.navigation.goBack();
  }

  goToBack() {
    this.navCtrl.back();
  }

  taskDeletePress() {
    this.allTasks.splice(this.selectedTaskIndex, 1);
  }

  redirectToMember(){
    this.router.navigate(['/committee-mapping-member',{id: this.monthlyBreakupList[0].EncyptcommitteeId, comtId: this.monthlyBreakupList[0].holderName}]);
  }


}
