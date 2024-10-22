import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { StorageService } from './storage.service';
import { applicationObject } from '../model/applicationEnum';
import { loginUserDetails } from '../model/common-model';
import { LocalNotifications } from '@capacitor/local-notifications';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundNotificationService {
  resourceData:any;
  constructor(private _commonService:CommonService,
    private _storageService:StorageService,private router:Router,
  private _language:LanguageService) {
      this._storageService.get(applicationObject.resourceData).then((data: any) => {
        if (data) {
          this.resourceData=data;
        } 
      }); 
     }

     resourceKeyValue(key:string){
      return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }

    async scheduleNotification() {
      const result = await LocalNotifications.requestPermissions();
    
      // Log the permission result
      console.log('Notification permission result:', result);
    
      if (result.display === 'granted') {
        this._storageService.get(applicationObject.loginUserDetails).then((res: loginUserDetails) => {
          if (res) {
            const now = new Date();
            const targetHour = 22; // 7 PM
            const targetMinutes = 15; // 20 minutes
            let scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinutes, 0, 0);
    
            // If current time is past 7:20 PM, schedule for tomorrow
            if (now > scheduledTime) {
              scheduledTime.setDate(scheduledTime.getDate() + 1);
            }
    
            // Log the scheduled notification time
            console.log('Scheduling notification for:', scheduledTime);
    
            // Fetch and schedule the notifications (log before API call)
            console.log('Fetching data for getAllCommitteePendingList_CreatedByLoginUser...');
            this._commonService.getCommitteeStatusNotificationDetails(res.encryptUserId, "getAllCommitteePendingList_CreatedByLoginUser").subscribe({
              next: (data) => {
                console.log('API response:', data);  // Log the API response
                if (data != null) {
                  console.log(`Scheduling notification: ${data.length} upcoming committees.`);
                  LocalNotifications.schedule({
                    notifications: [
                      {
                        title: `${data.length} ${this.resourceKeyValue('Notification_upcoming_committee_soon')}`,
                        body: this.resourceKeyValue('Notification_please_click_list_of_commoning_commit'),
                        id: 1,
                        actionTypeId: 'getTotalCommitteePending_CreatedByLoginUser',
                        extra: {
                          page: '/notification/getTotalCommitteePending_CreatedByLoginUser',
                        },
                        schedule: {
                          at: scheduledTime,
                          repeats: true,
                        },
                        smallIcon: 'res://mipmap/ic_launcher',
                      },
                    ],
                  });
                }
              },
              error: (e) => {
                console.error('Error fetching API data:', e);
              },
              complete: () => {
                console.log('API call complete');
              }
            });
    
            // Log after notification scheduling
            this.handleNotificationAction();
          }
        });
      } else {
        console.log('User did not grant notification permissions.');
        this._commonService.successAlertMsg('You have not granted notification permission');
      }
    }
    
    
    // async scheduleNotification() {
    //   await LocalNotifications.requestPermissions().then(result => {
    //      if (result.display.toLowerCase()=="granted".toLocaleLowerCase()) {
   
    //        this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
    //          if(res) {
   
    //            const now = new Date();
    //                const today8PM = new Date(
    //                  now.getFullYear(),
    //                  now.getMonth(),
    //                  now.getDate(),
    //                  19, // 8 PM
    //                  20,  // 0 minutes
    //                  0,  // 0 seconds
    //                  0   // 0 milliseconds
    //                );
   
       
               
    //            this._commonService.getCommitteeStatusNotificationDetails(res.encryptUserId,"getTotalCommitteePending_CreatedByLoginUser").subscribe({
    //              next:(data)=>{
    //                if(data !=null){
    //                console.log(data)
                   
         
    //                      LocalNotifications.schedule({
    //                        notifications: [
    //                          {
    //                            title: data.length +" "+ this.resourceKeyValue('Notification_upcoming_committee_soon'),
    //                            body: this.resourceKeyValue('Notification_please_click_list_of_commoning_commit'),
    //                            id: 1,
    //                            actionTypeId: 'getTotalCommitteePending_CreatedByLoginUser',
    //                            extra: {
    //                              page: '/notification/getTotalCommitteePending_CreatedByLoginUser',
    //                            },
    //                            schedule: { 
    //                              at: today8PM,
    //                              repeats: true, // Set it to repeat daily
    //                            },
    //                            smallIcon: 'res://mipmap//dhanvriksh_icon', 
    //                          },
    //                        ],
    //                      });
         
    //                }
    //              },
    //              error:(e)=>{
    //              },
    //              complete:()=>{
    //              }
    //              });
         
    //              this._commonService.getCommitteeStatusNotificationDetails(res.encryptUserId,"getTotalCommitteePending_CreatedByOtherUser").subscribe({
    //                next:(data)=>{
    //                  if(data !=null){
    //                  console.log(data)
                     
           
    //                        LocalNotifications.schedule({
    //                          notifications: [
    //                            {
    //                              title: data.length +" "+ this.resourceKeyValue('Notification_upcoming_committee_soon'),
    //                              body: this.resourceKeyValue('Notification_please_click_list_of_commoning_commit'),
    //                              id: 2,
    //                              actionTypeId: 'getTotalCommitteePending_CreatedByOtherUser',
    //                              extra: {
    //                                page: '/notification/getTotalCommitteePending_CreatedByOtherUser',
    //                              },
    //                              schedule: { 
    //                                at: today8PM,
    //                                repeats: true, // Set it to repeat daily
    //                              },
    //                              smallIcon: 'res://mipmap//dhanvriksh_icon', 
    //                            },
    //                          ],
    //                        });
           
    //                  }
    //                },
    //                error:(e)=>{
    //                },
    //                complete:()=>{
    //                }
    //                });
         
    //                this._commonService.getPaymentCommitteeNotificationDetails(res.encryptUserId,"getTotalPaymentPending_CreatedByLoginUser").subscribe({
    //                  next:(data)=>{
    //                    if(data !=null){
    //                    console.log(data)
                       
             
    //                          LocalNotifications.schedule({
    //                            notifications: [
    //                              {
    //                                title: data.length +" "+ this.resourceKeyValue('Notification_member_pending_committee_amount'),
    //                                body: this.resourceKeyValue('Notification_please_click_check_list_Member_pending_committee'),
    //                                id: 3,
    //                                actionTypeId: 'getTotalPaymentPending_CreatedByLoginUser',
    //                                extra: {
    //                                  page: '/notification/getTotalPaymentPending_CreatedByLoginUser',
    //                                },
    //                                schedule: { 
    //                                  at: today8PM,
    //                                  repeats: true, // Set it to repeat daily
    //                                },
    //                                smallIcon: 'res://mipmap//dhanvriksh_icon', 
    //                              },
    //                            ],
    //                          });
             
    //                    }
    //                  },
    //                  error:(e)=>{
    //                  },
    //                  complete:()=>{
    //                  }
    //                  });
         
    //                  this._commonService.getPaymentCommitteeNotificationDetails(res.encryptUserId,"getTotalPaymentPending_CreatedByOtherUser").subscribe({
    //                    next:(data)=>{
    //                      if(data !=null){
    //                            LocalNotifications.schedule({
    //                              notifications: [
    //                                {
    //                                  title: data.length +" "+ this.resourceKeyValue('Notification_member_pending_committee_amount'),
    //                                  body: this.resourceKeyValue('Notification_please_click_check_list_Member_pending_committee'),
    //                                  id: 4,
    //                                  actionTypeId: 'getTotalPaymentPending_CreatedByOtherUser',
    //                                  extra: {
    //                                    page: '/notification/getTotalPaymentPending_CreatedByOtherUser',
    //                                  },
    //                                  schedule: { 
    //                                    at: today8PM,
    //                                    repeats: true, // Set it to repeat daily
    //                                  },
    //                                  smallIcon: 'res://mipmap//dhanvriksh_icon', 
    //                                },
    //                              ],
    //                            });
               
    //                      }
    //                    },
    //                    error:(e)=>{
    //                    },
    //                    complete:()=>{
    //                    }
    //                    });
        
    //          }
    //        });
   
    //        this.handleNotificationAction();
   
    //      } else {
    //       this._commonService.successAlertMsg('You have not permission')
    //      }
    //    }); 
    //  }
   
     async handleNotificationAction() { 
       try{
      await LocalNotifications.addListener('localNotificationActionPerformed', async (notification:any) => {
         console.log(notification)
         if (notification.notification.actionTypeId === 'getTotalCommitteePending_CreatedByLoginUser') {
           this.router.navigateByUrl(notification.notification.extra.page);
           // Redirect to the details page
         }
         else    if (notification.notification.actionTypeId === 'getTotalCommitteePending_CreatedByOtherUser') {
           this.router.navigateByUrl(notification.notification.extra.page);
           // Redirect to the details page
         }
         else if (notification.notification.actionTypeId === 'getTotalPaymentPending_CreatedByLoginUser') {
           this.router.navigateByUrl(notification.notification.extra.page);
           // Redirect to the details page
         }
         else if (notification.notification.actionTypeId === 'getTotalPaymentPending_CreatedByOtherUser') {
           this.router.navigateByUrl(notification.notification.extra.page);
           // Redirect to the details page
         }

       });
     }
     catch(error){
       this._commonService.errorAlertMsg('You have recevied error '+error)
     }
     }
}
