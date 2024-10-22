import { Injectable } from '@angular/core';
import { mobileNumberOTPModel } from '../model/common-model';
import { Observable } from 'rxjs';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private URL=environment.url+"/api/Common";
  private loading:any="";
  constructor(private http:HttpClient,
    private toastController: ToastController,private alertController: AlertController
    ,private loaderCtrl:LoadingController) { }

  getDropdownList(option1:string):Observable<any>{
    return this.http.get(this.URL+"/getDropdownList?option1="+option1);
  }

  getDropdownList2(option1:string,option2:string):Observable<any>{
    return this.http.get(this.URL+"/getDropdownList2?option1="+option1+"&option2="+option2);
  }

  getDropdownList3(option1:string,option2:string,option3:string):Observable<any>{
    return this.http.get(this.URL+"/getDropdownList3?option1="+option1+"&option2="+option2+"&option3="+option3);
  }

  getDropdownList4(option1:string,option2:string,option3:string,option4:string):Observable<any>{
    return this.http.get(this.URL+"/getDropdownList4?option1="+option1+"&option2="+option2+"&option3="+option3+"&option4="+option4);
  }

  getDropdownList5(option1:string,option2:string,option3:string,option4:string,option5:string):Observable<any>{
    return this.http.get(this.URL+"/getDropdownList5?option1="+option1+"&option2="+option2+"&option3="+option3+"&option4="+option4+"&option5="+option5);
  }

  saveMobileOTPData(objdata:mobileNumberOTPModel):Observable<any>{
    return this.http.post(this.URL+"/saveMobileOTPData",objdata)
  }


  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  async successAlertMsg(msg:string) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async errorAlertMsg(msg:string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  getDashboardNotificationDetails(userId:string):Observable<any>{
    return this.http.get(this.URL+"/getDashboardNotificationDetails?userId="+userId);
  }

  getPaymentCommitteeNotificationDetails(userId:string,action:string):Observable<any>{
    return this.http.get(this.URL+"/getPaymentCommitteeNotificationDetails?userId="+userId+"&action="+action);
  }

  getCommitteeStatusNotificationDetails(userId:string,action:string):Observable<any>{
    return this.http.get(this.URL+"/getCommitteeStatusNotificationDetails?userId="+userId+"&action="+action);
  }

  getCountTotalNotificationDetails(userId:string,action:string):Observable<any>{
    return this.http.get(this.URL+"/getCountTotalNotificationDetails?userId="+userId+"&action="+action);
  }


  showLoader(){
    this.loaderCtrl.create({
      message:'loading....'
    }).then((overlay)=>{
      this.loading=overlay;
      this.loading.present();
    })
  }
  
  hideLoader(){
    setTimeout(() => {
      this.loading.dismiss();
    }, 1000);
  }

  GetDashboardCountNotification(userId:string):Observable<any>{
    return this.http.get(this.URL+"/GetDashboardCountNotification?userId="+userId);
  }

  GetDashboardRecentNotification(userId:string):Observable<any>{
    return this.http.get(this.URL+"/GetDashboardRecentNotification?userId="+userId);
  }

  GetRecentTransaction(userId:string):Observable<any>{
    return this.http.get(this.URL+"/GetRecentTransaction?userId="+userId);
  }

  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, environment.apiKey).toString();
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, environment.apiKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }


  membersList: any = [
    {
      id: 'i1',
      image: '../../../assets/images/users/user3.png',
      name: 'Jenny Wilson',
      profession: 'Designer',
      selected: false,
    },
    {
      id: 'i2',
      image: '../../../assets/images/users/user2.png',
      name: 'Esther Howard',
      profession: 'Back-end developer',
      selected: false,
    },
    {
      id: 'i3',
      image: '../../../assets/images/users/user5.png',
      name: 'Cameron Williamson',
      profession: 'flutter develpoer',
      selected: false,
    },
    {
      id: 'i4',
      image: '../../../assets/images/users/user7.png',
      name: 'Cameron Williamson',
      profession: 'flutter develpoer',
      selected: false,
    },
    {
      id: 'i5',
      image: '../../../assets/images/users/user4.png',
      name: 'Brooklyn Simmons',
      profession: 'Back-end developer',
      selected: false,
    },
    {
      id: 'i6',
      image: '../../../assets/images/users/user8.png',
      name: 'Cameron Williamson',
      profession: 'Back-end developer',
      selected: false,
    },
    {
      id: 'i7',
      image: '../../../assets/images/users/user6.png',
      name: 'Savannah Nguyen',
      profession: 'ui ux designer',
      selected: false,
    },
    {
      id: 'i8',
      image: '../../../assets/images/users/user10.png',
      name: 'Kristin Watson',
      profession: 'flutter develpoer',
      selected: false,
    },
    {
      id: 'i9',
      image: '../../../assets/images/users/user11.png',
      name: 'Leslie Alexander',
      profession: 'flutter develpoer',
      selected: false,
    },
  ];

  dummyMembers: any = [
    '../../../assets/images/users/user14.png',
    '../../../assets/images/users/user12.png',
    '../../../assets/images/users/user13.png',
    '../../../assets/images/users/user3.png',
    '../../../assets/images/users/user14.png',
    '../../../assets/images/users/user11.png',
    '../../../assets/images/users/user10.png',
    '../../../assets/images/users/user9.png',
    '../../../assets/images/users/user8.png',
  ];

  activeProjectsList: any = [
    {
      id: '1',
      title: 'Shopping app project',
      date: '25 feb 2023',
      taskCount: '15 task',
      progress: 30,
      members: this.dummyMembers.slice(0, 6),
      fill: 'var(--woodenColor)',
      unfill: 'rgba(218, 152, 135, 0.16)',
    },
    {
      id: '2',
      title: 'Food delivery app project',
      date: '22 feb 2023',
      taskCount: '15 task',
      progress: 50,
      members: this.dummyMembers.slice(0, 5),
      fill: 'var(--parrotColor)',
      unfill: 'rgba(102, 195, 144, 0.16)',
    },
    {
      id: '3',
      title: '5 star hotel website',
      date: '22 feb 2023',
      taskCount: '10 task',
      progress: 60,
      members: this.dummyMembers.slice(0, 7),
      fill: 'var(--tomatoColor)',
      unfill: 'rgba(229, 113, 110, 0.16)',
    },
    {
      id: '4',
      title: 'Student tracking app',
      date: '9 feb 2023',
      taskCount: '15 task',
      progress: 60,
      members: this.dummyMembers.slice(0, 8),
      fill: 'var(--blueColor)',
      unfill: 'rgba(124, 146, 228, 0.16)',
    },
    {
      id: '5',
      title: 'PDF scanner app project',
      date: '8 feb 2023',
      taskCount: '10 task',
      progress: 80,
      members: this.dummyMembers.slice(0, 9),
      fill: 'var(--woodenColor)',
      unfill: 'rgba(218, 152, 135, 0.16)',
    },
    {
      id: '6',
      title: 'Ecommerce app project',
      date: '9 feb 2023',
      taskCount: '15 task',
      progress: 90,
      members: this.dummyMembers.slice(0, 6),
      fill: 'var(--tomatoColor)',
      unfill: 'rgba(229, 113, 110, 0.16)',
    }
  ];

  completedProjectsList:any = [
    {
      id: '1',
      title: 'Shopping app project',
      date: '25 feb 2023',
      taskCount: '15 task',
      members: this.dummyMembers.slice(0, 6),
      fill: 'var(--woodenColor)',
      unfill: 'rgba(218, 152, 135, 0.16)',
    },
    {
      id: '2',
      title: 'Food delivery app project',
      date: '22 feb 2023',
      taskCount: '15 task',
      members: this.dummyMembers.slice(0, 5),
      fill: 'var(--parrotColor)',
      unfill: 'rgba(102, 195, 144, 0.16)',
    },
    {
      id: '3',
      title: '5 star hotel website',
      date: '22 feb 2023',
      taskCount: '10 task',
      members: this.dummyMembers.slice(0, 7),
      fill: 'var(--tomatoColor)',
      unfill: 'rgba(229, 113, 110, 0.16)',
    },
    {
      id: '4',
      title: 'Student tracking app',
      date: '9 feb 2023',
      taskCount: '15 task',
      members: this.dummyMembers.slice(0, 8),
      fill: 'var(--blueColor)',
      unfill: 'rgba(124, 146, 228, 0.16)',
    },
    {
      id: '5',
      title: 'PDF scanner app project',
      date: '8 feb 2023',
      taskCount: '10 task',
      members: this.dummyMembers.slice(0, 9),
      fill: 'var(--woodenColor)',
      unfill: 'rgba(218, 152, 135, 0.16)',
    },
    {
      id: '6',
      title: 'Ecommerce app project',
      date: '9 feb 2023',
      taskCount: '15 task',
      members: this.dummyMembers.slice(0, 6),
      fill: 'var(--tomatoColor)',
      unfill: 'rgba(229, 113, 110, 0.16)',
    }
  ];

}
