import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../services/util.service';
import { ModalController, NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { applicationObject, responseEnum } from '../model/applicationEnum';
import { loginUserDetails } from '../model/common-model';
import { LanguageService } from '../services/language.service';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend } from 'chart.js';
import { CommonService } from '../services/common.service';
import { UserRegistrationService } from '../services/user-registration.service';
import { userRegistrationModel } from '../model/userRegistration-model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  
resourceData: any[] = [];

createdCommitteeAmountDueList:any;
    asMemberCommitteeAmountDueList:any;
    upcommingCommtCreatdByOwn:any;
    upcommingCommtCreatdByOther:any;
    previousPageUrl:string;
    loginUserData:loginUserDetails;
    serviceType = 'committee';
    
  // Notifications and transactions
  limitedNotifications = [];
  recentTransactions = [];

  // Selected currency and language
  selectedCurrency: string = 'USD';
  selectedLanguage: string = 'en';
  userName: string = '';
  currentDate: Date = new Date();

  currentHour: number = new Date().getHours();
  greetingMessage: string = 'Good Morning';

  notificationCount:any;
  notificationrecentData:any;
  hasMoreNotifications:boolean=false;

  transactionrecentData:any;
  hasMoreTransaction:boolean=false;

  notificationIncome: number = 0; // To store income data
  notificationExpense: number = 0; // To store expense data
  objdata=new userRegistrationModel();
  constructor(
    private router: Router,
    public util: UtilService,
    private _userRegistrationService:UserRegistrationService,
    private _storageService:StorageService,
    private _language:LanguageService,
    private navCtrl: NavController,
    private _commonService: CommonService
  ) {
    this.updateGreetingMessage();
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
                  this.selectedLanguage=this.loginUserData.preferredlanguage==null?"en":this.loginUserData.preferredlanguage;
                  this.userName=this.loginUserData.firstName+' '+this.loginUserData.lastName;
                  this.GetDashboardRecentNotification(res.encryptUserId);
                  this.GetRecentTransaction(res.encryptUserId)
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

  updateGreetingMessage() {
    if (this.currentHour < 12) {
      this.greetingMessage = 'Good Morning';
    } else if (this.currentHour >= 12 && this.currentHour < 18) {
      this.greetingMessage = 'Good Afternoon';
    } else {
      this.greetingMessage = 'Good Evening';
    }
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }

  ngOnInit() {
  }

  segmentChanged(eve: any) {
    this.serviceType = eve.detail.value;
    if (this.serviceType.toLowerCase() == 'committee'.toLowerCase()) {
      
    } else if (this.serviceType.toLowerCase() == 'loan'.toLowerCase()) {
      
    } else if (this.serviceType.toLowerCase() == 'expense'.toLowerCase()) {
      
    }
  }

  
 


  allCategories() {
    this.router.navigate(['/tabs/home/categories']);
  }

  ionViewDidEnter() {
    this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
      if(res) {
        this.loginUserData=res;
        this.GetDashboardCountNotification(res.encryptUserId);
      }
    });
   // this.loadIncomeExpenseChart(); // Now called after the view is fully loaded
  }

  loadIncomeExpenseChart(notificationIncome:any,notificationExpense:any) {
    // Register the required components
    Chart.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend);

    const canvas = document.getElementById('incomeExpenseChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      const chart = new Chart(ctx, {
        type: 'bar', // Bar chart
        data: {
          labels: ['Income', 'Expense'],
          datasets: [
            {
              label: 'Amount',
              data: [notificationIncome, notificationExpense], // Replace this with dynamic data
              backgroundColor: ['#4caf50', '#f44336'], // Colors for bars
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category', // X-axis as category
            },
            y: {
              type: 'linear', // Y-axis as linear scale
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  // Method to handle language change
  toggleLanguage(event: any) {
    this._commonService.showLoader();
    this.selectedLanguage = event.detail.value; // Update selected language
    this.objdata.userId =this.loginUserData.encryptUserId ;
        this.objdata.firstName=this.loginUserData.firstName;
        this.objdata.lastName=this.loginUserData.lastName;
        this.objdata.emailAddress=this.loginUserData.emailAddress;
        this.objdata.address=this.loginUserData.address;
        this.objdata.country=this.loginUserData.countryId;
        this.objdata.gender =this.loginUserData.gender;
        this.objdata.preferredlanguage =this.selectedLanguage
        this.objdata.action ="updateUserDetails";
        this._userRegistrationService.saveUpdateUserRegistrationData(this.objdata).subscribe(data=>{
          if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
            this.loginUserData.preferredlanguage=this.selectedLanguage;
            this._storageService.set(applicationObject.loginUserDetails,this.loginUserData); 
            this._storageService.removeItem(applicationObject.resourceData)
            this._language.setLanguage(this.selectedLanguage);
            this._storageService.set(applicationObject.language,this.selectedLanguage);
            this._language.getResourceData().then((resourceData) => {
              this._commonService.hideLoader();
              window.location.reload();
            })
            .catch((error) => {
              this._commonService.hideLoader();
              console.error('Error:', error);
            });
          }
          else{
            this._commonService.hideLoader();
          }
        })

    // Add logic to change the application language here, if using a translation service
  }

  viewMore(type: string) {
    if (type === 'notifications') {
      // Navigate to the notifications page
      this.navCtrl.navigateRoot(['/recent-notification']);
    } else if (type === 'transactions') {
      // Navigate to the transactions page
      this.navCtrl.navigateRoot(['/recent-transaction']);
    }
  }

  GetDashboardCountNotification(userId:string){
      this._commonService.GetDashboardCountNotification(userId).subscribe({
        next:(data)=>{
        if(data!=null && data.length>0){
          this.notificationCount=data[0];
          this.notificationIncome=(this.notificationCount.TotalCommitteeParticpateAmount+this.notificationCount.TotalCommitteeOwnerAmount+this.notificationCount.TotalLoanGiverAmount);
          this.notificationExpense=this.notificationCount.TotalLoanTakenAmount;
        }
        else{
          this.notificationCount=[];
          this.notificationIncome=0;
          this.notificationExpense=0;
        }
        this.loadIncomeExpenseChart(this.notificationIncome,this.notificationExpense);
        console.log(this.notificationIncome)
        console.log(this.notificationExpense)
        console.log(this.notificationCount)
      },
      error:(e)=>{
        this.notificationCount=[];
        console.log(e)
      },
      complete:()=>{
        
      }
    });
  }

  GetDashboardRecentNotification(userId:string){
    this._commonService.GetDashboardRecentNotification(userId).subscribe({
      next:(data)=>{
        if (data != null && data.length > 0) {
          this.notificationrecentData = data.slice(0, 5); // Limit the array to the first 5 items
          this.hasMoreNotifications = data.length > 5; // Check if there are more than 5 items
        } else {
          this.notificationrecentData = [];
          this.hasMoreNotifications = false; // No "View More" button needed if there's no data
        }
        console.log(this.notificationrecentData);
    },
    error:(e)=>{
      console.log(e)
    },
    complete:()=>{
      
    }
  });
}

redirectToPage(type:string){
  if(type.toLowerCase()=='committee'){
    this.navCtrl.navigateRoot(['/committee-tabs/committee-list']);
  }
  else if(type.toLowerCase()=='loan'){
    this.navCtrl.navigateRoot(['/loan-tabs/loan-list']);
  }
}

redirectToRecentNotificationPage(type:string,Id:string){
  if(type.toLowerCase()=='committee'){
    this.router.navigate(['/committee-monthly-breakup',Id]);
  }
  else if(type.toLowerCase()=='loan'){
    this.navCtrl.navigateForward(['/loan-detail-by-id'], { queryParams: { loanId: Id } });
  }
}

GetRecentTransaction(userId:string){
  this._commonService.GetRecentTransaction(userId).subscribe({
    next:(data)=>{
      if (data != null && data.length > 0) {
        this.transactionrecentData = data.slice(0, 5); // Limit the array to the first 5 items
        this.hasMoreTransaction = data.length > 5; // Check if there are more than 5 items
      } else {
        this.transactionrecentData = [];
        this.hasMoreTransaction = false; // No "View More" button needed if there's no data
      }
      console.log(this.transactionrecentData);
  },
  error:(e)=>{
    console.log(e)
  },
  complete:()=>{
    
  }
});
}


}
