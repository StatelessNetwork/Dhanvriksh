import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { LoanService } from './loan.service';
import { CommonService } from './common.service';
import { CommitteeService } from './committee.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  private userId: string | null = null;
  upcomingPaymentList: any = null;
  overduePaymentList: any = null;
  partialPaymentUpcomingList: any = null;
  fullPaidList: any = null;
  UpcomingPaymentListForOwner: any = null;
  OverduePaymentListForOwner: any = null;
  PartialPaymentUpcomingListForOwner: any = null;


  UpcomingCommittee: any = null;
  PendingPayments: any = null;
  UpcomingCommitteeParticipant: any = null;
  PendingPaymentParticipant: any = null;
  constructor(private http: HttpClient,
    private _loanService:LoanService,
    private _commonService:CommonService,
    private _committeeService:CommitteeService
  ) {}

  async scheduleNotification(userId: string) {
    await LocalNotifications.requestPermissions().then(result => {
       if (result.display.toLowerCase()=="granted".toLocaleLowerCase()) {
        this.fetchLoanDataFromAPI(userId);
       }else {
        this._commonService.successAlertMsg('You have not permission')
       }
      });
    }


  /**
   * Fetch data from the API based on the user ID and handle the response
   */
  fetchLoanDataFromAPI(userId: string) {
    this._loanService.GetLoanNotification(userId).subscribe({
      next: (response) => {
       this.sendLocalNotification(response);
      },
      error: async (err) => {
 
      }
    });
  }

  /**
   * Send a local notification with the fetched API data
   * @param data Data fetched from the API to display in the notification
   */
  async sendLocalNotification(response: any) {

    if (response && response.length > 0) {
      if (response[0] && response[0].length > 0) {
        const upcomingPaymentListData:any = JSON.parse(response[0]); // First array
        this.upcomingPaymentList=upcomingPaymentListData;
      } else {
        this.upcomingPaymentList = []; // or handle it appropriately if it's null or empty
      }

      if (response[1] && response[1].length > 0) {
        const overduePaymentListData:any = JSON.parse(response[1]); // First array
        this.overduePaymentList=overduePaymentListData;
      } else {
        this.overduePaymentList = []; // or handle it appropriately if it's null or empty
      }

      if (response[2] && response[2].length > 0) {
        const partialPaymentUpcomingData:any = JSON.parse(response[2]); // First array
        this.partialPaymentUpcomingList=partialPaymentUpcomingData;
      } else {
        this.partialPaymentUpcomingList = []; // or handle it appropriately if it's null or empty
      }

      if (response[3] && response[3].length > 0) {
        const fullPaidListData:any = JSON.parse(response[3]); // First array
        this.fullPaidList=fullPaidListData;
      } else {
        this.fullPaidList = []; // or handle it appropriately if it's null or empty
      }
    }

    const allData = [
      { title: 'Upcoming Payments', data: this.upcomingPaymentList },
      { title: 'Overdue Payments', data: this.overduePaymentList },
      { title: 'Partial Payments', data: this.partialPaymentUpcomingList },
      { title: 'Fully Paid Loans', data: this.fullPaidList },
      { title: 'Upcoming Payments For Owner', data: this.UpcomingPaymentListForOwner },
      { title: 'Overdue Payments For Owner', data: this.OverduePaymentListForOwner },
      { title: 'Partial Payments For Owner', data: this.PartialPaymentUpcomingListForOwner }
    ];

     // Schedule notifications at 9 AM every day for each dataset
     const notificationTime = this.getNotificationTime(9); // Get 9 AM time for today or tomorrow


    for (let i = 0; i < allData.length; i++) {
      const dataSet:any = allData[i];
      if (dataSet!=null && dataSet.data!=null && dataSet.data.length > 0) {
        for (let j = 0; j < dataSet.data.length; j++) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: dataSet.data[j].Title,
              body: dataSet.data[j].Message,
              id: dataSet.data[j].EncyptLoanId, // Unique ID for each notification
              schedule: { at: notificationTime },
              sound: null,
              attachments: null,
              actionTypeId: dataSet.data[j].ActionType,
              extra: { page: '/dashboard' },  // Example page on notification click
              smallIcon: 'res://mipmap//dhanvriksh_icon'  // Android small icon
            },
          ],
        });
      }
      }
    }
  }

  private getNotificationTime(hour: number): Date {
    const now = new Date();
    const notificationTime = new Date();
    
    // Set the time to 9 AM today
    notificationTime.setHours(hour, 0, 0, 0);
  
    // If 9 AM is already passed for today, schedule for tomorrow
    if (now > notificationTime) {
      notificationTime.setDate(notificationTime.getDate() + 1); // Set for tomorrow
    }
  
    return notificationTime;
  }

  // Get Committee Notification Data

    /**
   * Fetch data from the API based on the user ID and handle the response
   */
    fetchCommitteeDataFromAPI(userId: string) {
      this._committeeService.GetCommitteeNotification(userId).subscribe({
        next: (response) => {
         this.sendLocalNotification(response);
        },
        error: async (err) => {
   
        }
      });
    }

    async sendLocalCommitteeNotification(response: any) {

      if (response && response.length > 0) {
        if (response[0] && response[0].length > 0) {
          const upcomingPaymentListData:any = JSON.parse(response[0]); // First array
          this.upcomingPaymentList=upcomingPaymentListData;
        } else {
          this.upcomingPaymentList = []; // or handle it appropriately if it's null or empty
        }
  
        if (response[1] && response[1].length > 0) {
          const overduePaymentListData:any = JSON.parse(response[1]); // First array
          this.overduePaymentList=overduePaymentListData;
        } else {
          this.overduePaymentList = []; // or handle it appropriately if it's null or empty
        }
  
        if (response[2] && response[2].length > 0) {
          const partialPaymentUpcomingData:any = JSON.parse(response[2]); // First array
          this.partialPaymentUpcomingList=partialPaymentUpcomingData;
        } else {
          this.partialPaymentUpcomingList = []; // or handle it appropriately if it's null or empty
        }
  
        if (response[3] && response[3].length > 0) {
          const fullPaidListData:any = JSON.parse(response[3]); // First array
          this.fullPaidList=fullPaidListData;
        } else {
          this.fullPaidList = []; // or handle it appropriately if it's null or empty
        }
      }
  
      const allData = [
        { title: 'Upcoming Committee', data: this.UpcomingCommittee },
        { title: 'Committee Payments Due', data: this.PendingPayments },
        { title: 'Upcoming Committee', data: this.UpcomingCommitteeParticipant },
        { title: 'Committee Payment Due', data: this.PendingPaymentParticipant }
      ];
  
       // Schedule notifications at 9 AM every day for each dataset
       const notificationTime = this.getNotificationTime(9); // Get 9 AM time for today or tomorrow
  
  
      for (let i = 0; i < allData.length; i++) {
        const dataSet:any = allData[i];
        if (dataSet!=null && dataSet.data!=null && dataSet.data.length > 0) {
        for (let j = 0; j < dataSet.data.length; j++) {
          await LocalNotifications.schedule({
            notifications: [
              {
                title: dataSet.data[j].Title,
                body: dataSet.data[j].Message,
                id: dataSet.data[j].EncyptLoanId, // Unique ID for each notification
                schedule: { at: notificationTime },
                sound: null,
                attachments: null,
                actionTypeId: dataSet.data[j].ActionType,
                extra: { page: '/dashboard' },  // Example page on notification click
                smallIcon: 'res://mipmap//dhanvriksh_icon'  // Android small icon
              },
            ],
          });
        }
        }
      }
    }
}
