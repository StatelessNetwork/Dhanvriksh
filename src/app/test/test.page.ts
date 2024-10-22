import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, PopoverController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
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

  constructor(public router: Router, public commonList: CommonService, public platform: Platform, public popCtrl: PopoverController, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('item')) {
        this.item = JSON.parse(`${paramMap.get('item')}`);
      }
    });
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


}
