import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/util.service';
import { LanguageService } from '../services/language.service';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  resourceData:any;
  faqData: { question: string; answer: string; expanded: boolean }[] =[];
  constructor(public util: UtilService,
    private _language:LanguageService,
    private navCtrl: NavController,
    private _storageService:StorageService) {
   
    this._storageService.get(applicationObject.resourceData).then((data: any) => {
    if (data) {
      this.resourceData=data;
      this.faqData = [
        {
          question: this.resourceKeyValue('Faq_question_1'),
          answer: this.resourceKeyValue('Faq_answer_1'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_2'),
          answer: this.resourceKeyValue('Faq_answer_2'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_3'),
          answer: this.resourceKeyValue('Faq_answer_3'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_4'),
          answer: this.resourceKeyValue('Faq_answer_4'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_5'),
          answer: this.resourceKeyValue('Faq_answer_5'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_6'),
          answer: this.resourceKeyValue('Faq_answer_6'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_7'),
          answer: this.resourceKeyValue('Faq_answer_7'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_8'),
          answer: this.resourceKeyValue('Faq_answer_8'),
          expanded: false,
        },
        {
          question: this.resourceKeyValue('Faq_question_9'),
          answer: this.resourceKeyValue('Faq_answer_9'),
          expanded: false,
        }
        // Add more questions and answers as needed
      ];
    } 
  }); 
}


  ngOnInit() {
   
  }

 

  toggleAnswer(faq: any) {
    faq.expanded = !faq.expanded;
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }

  goBack() {
    this.navCtrl.back();
  }

}
