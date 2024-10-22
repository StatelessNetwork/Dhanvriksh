import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  resourceData:any;
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  currentIndex = 0;
  screenWidth = window.innerWidth;

  onboardingScreenList = [
    {
      id: '1',
      title: 'Organize your task',
      description: 'Lorem ipsum dolor sit amet consectetur. Quam risus sem amet. Condimentum magna vitae mauris sed integer lacus nec arcu. Gravida s',
      image: '../../../assets/images/onboarding/onboarding1.png'
    },
    {
      id: '2',
      title: 'Organize your project',
      description: 'Lorem ipsum dolor sit amet consectetur. Quam risus sem amet. Condimentum magna vitae mauris sed integer lacus nec arcu. Gravida s',
      image: '../../../assets/images/onboarding/onboarding2.png'
    },
    {
      id: '3',
      title: 'Always connect with team',
      description: 'Lorem ipsum dolor sit amet consectetur. Quam risus sem amet. Condimentum magna vitae mauris sed integer lacus nec arcu. Gravida s',
      image: '../../../assets/images/onboarding/onboarding3.png'
    },
  ];

  constructor(private route:Router,
    private _language:LanguageService,
    private _storageService:StorageService,
    private navCtrl: NavController,
    private routerOutlet: IonRouterOutlet
  ) {
       
  }

  ngOnInit(): void {
    this._storageService.get(applicationObject.resourceData).then((data: any) => {
      if (data) {
        this.resourceData=data;
      } 
    });

  }
  
  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }


  getStarted(){
    this._storageService.set(applicationObject.isFirstTimeSliderhOpenApp,true)
    
        this._storageService.get(applicationObject.language).then((lang) => {
          if(lang!=null){
            this.route.navigate(['/login']);
          }
          else{
            this.route.navigate(['/languages']) 
          }
        });
  }


  ionViewDidEnter() {
    if (Capacitor.isNativePlatform()) {
    this.routerOutlet.swipeGesture = false;
    StatusBar.setBackgroundColor({ color: '#9672FB' });
    StatusBar.setOverlaysWebView({ overlay: false });
    }
  }

  ionViewWillLeave() {
    if (Capacitor.isNativePlatform()) {
    this.routerOutlet.swipeGesture = true;
    StatusBar.setBackgroundColor({ color: 'transparent' });
    StatusBar.setOverlaysWebView({ overlay: true });
    }
  }

  slideChangeCall() {
    this.currentIndex = this.swiperRef?.nativeElement.swiper.activeIndex;
  }

  handleButtonPress() {
    if (this.currentIndex === 2) {
      this.getStarted();
    }
    else {
      this.swiperRef?.nativeElement.swiper.slideTo(this.currentIndex == 0 ? 1 : 2);
    }
  }


}
