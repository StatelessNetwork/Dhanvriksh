import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import { applicationObject } from 'src/app/model/applicationEnum';
import { CommonService } from 'src/app/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener';
import { Share } from '@capacitor/share';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { LanguageService } from 'src/app/services/language.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  NotoSansDevanagari: {
    normal: 'http://testapi.airportporterservice.com/fonts/NotoSansDevanagari-Regular.ttf',
    bold: 'http://testapi.airportporterservice.com/fonts/NotoSansDevanagari-Bold.ttf'
   // italics: 'http://testapi.airportporterservice.com/fonts/NotoSansDevanagari-Italic.ttf',
    //bolditalics: 'http://testapi.airportporterservice.com/fonts/NotoSansDevanagari-BoldItalic.ttf',
  },
  Roboto: {
    normal: 'http://testapi.airportporterservice.com/fonts/Roboto-Regular.ttf',
    bold: 'http://testapi.airportporterservice.com/fonts/Roboto-Bold.ttf',
    italics: 'http://testapi.airportporterservice.com/fonts/Roboto-Italic.ttf',
    bolditalics: 'http://testapi.airportporterservice.com/fonts/Roboto-BoldItalic.ttf',
  },
};


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit {
  item: { title: string; description: string };
  isCommitteeShow:boolean=false;
  totalNumberofMonth:number=0;
  startDate:any="";
  endDate:any="";
  totalCommitteePrice:number=0;
  perHeadCommittee:number=0;
  totalMember:number=0;
  committeeForm: FormGroup;
  imageBase64:string="";
  PDFData:any[]=[];
  htmlPDFData:string="";
  fileName:string;
  pdfObj = null;
  resourceData:any;
  submitted = false;
  isLogin: boolean = false;
  constructor(private formBuilder: FormBuilder,public datepipe: DatePipe, private router:Router,
    private _storageService:StorageService,private _commonService:CommonService,
    private file:File,private http: HttpClient,public util: UtilService,
    private navCtrl: NavController,private _language:LanguageService) { 
      this._storageService.get(applicationObject.token).then(data => {
        if(data){
          let currentDateTime:any= new Date().getTime();
          let expiryDateTime=new Date(data.expirationDate).getTime();
          if(currentDateTime<=expiryDateTime)
          {
            this._storageService.get(applicationObject.resourceData).then((data: any) => {
              if (data) {
                this.resourceData=data;
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
    this.committeeForm = this.formBuilder.group({
      totalPrice: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      totalNumberOfMonths: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      startDate: [this.getCurrentDate(), Validators.required],
    });
  }

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
    }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  calculatePerCommitteePrice() {
    try{
    this._commonService.showLoader();
    const totalPrice =this.committeeForm.value.totalPrice;
    const totalMonths = this.committeeForm.value.totalNumberOfMonths;

    if (totalPrice !== null && totalMonths !== null && totalMonths !== 0) {
      const perCommitteePrice = totalPrice / totalMonths;
      this.committeeForm.patchValue({
        perCommitteePrice:perCommitteePrice.toFixed(2)
      })
    } else {
      this.committeeForm.patchValue({
        perCommitteePrice:''
      })
    }
    this._commonService.hideLoader();
  }
  catch{
this._commonService.hideLoader();
  }
  }

  calculatorData(){
    if(Number(this.committeeForm.value.totalPrice)>0 && Number(this.committeeForm.value.totalNumberOfMonths)>0)
    {
    this.isCommitteeShow=true;
    this.totalCommitteePrice =this.committeeForm.value.totalPrice;
    this.totalNumberofMonth = this.committeeForm.value.totalNumberOfMonths;
    this.perHeadCommittee = this.totalCommitteePrice / this.totalNumberofMonth;
    this.startDate=this.datepipe.transform(this.committeeForm.value.startDate, 'dd-MMM-yyyy');
    var start_Date = moment(this.startDate);
    this.endDate=this.datepipe.transform(moment(start_Date).add(this.totalNumberofMonth, 'months').calendar(), 'dd-MMM-yyyy');
    this.totalMember=this.committeeForm.value.totalNumberOfMonths;
    }
    else{
      this.isCommitteeShow=true;
      this.totalCommitteePrice =this.committeeForm.value.totalPrice;
      this.totalNumberofMonth = this.committeeForm.value.totalNumberOfMonths;
      this.perHeadCommittee = 0;
      this.startDate=this.datepipe.transform(this.committeeForm.value.startDate, 'dd-MMM-yyyy');
      this.endDate=this.datepipe.transform(this.committeeForm.value.startDate, 'dd-MMM-yyyy');
      this.totalMember=0;
    }
  }

  async shareCommitteeDetails(){
    let currentLanguage:string;
    const logoPath = 'http://testapi.airportporterservice.com/images/logo.png'; 
    const imageContent = await this.fetchImageContent(logoPath);
    const currentDate = new Date().toLocaleDateString();
     // Create a PDF document definition with dynamic data
    //  this._storageService.get(applicationObject.language).then((lang) => {
    //   if(lang!=null){
    //    currentLanguage=lang;
    //   }
    //   else{
         currentLanguage="en";
    //   }
    // });
     const documentDefinition = {
      content: [
              {
          columns: [
            {
              width: 'auto',
              image: 'data:image/png;base64,' + imageContent,
              fit: [50, 50], // Adjust the size of the logo as needed
            },
            {
              width: '*',
              text: 'Dhanvriksh\n' + currentDate,
              style: 'company',
              alignment: 'right'
            },
          ],
        },
        { text: '\n' }, // Add some space between the logo/date and the heading
        { text: 'Document Heading', style: 'header' },
        { text: '\n\n' }, // Add space between the heading and the table
        {
          layout: 'bordered',
          margin: [130,0,0, 0], // Set left and right margins to 25% each
          table: this.generateTable(),
          style: currentLanguage=='en' ? 'tableStyle' : 'tableStyleHindi',
        },
      ],
      styles: {
             header: {
          alignment: 'center',
          fontSize: 18,
          bold: true,
        },
        company: {
          fontSize: 12,
          margin: [0, 10, 0, 0], // Adjust the margin as needed
        },
        cell: {
          padding: 7,
          fontSize: 14,
          border: '1px solid #ddd',
        },
        tableStyle: {
          fontSize: 15,
        },
        tableStyleHindi: {
          font: 'NotoSansDevanagari', // Set the font for the entire table
          fontSize: 15,
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  
    // Use the callback approach for getBuffer
    pdfDocGenerator.getBuffer(async (buffer: ArrayBuffer) => {
      if (buffer.byteLength > 0) {
        try{
        // Create a Blob from the buffer
        const blob = new Blob([buffer], { type: 'application/pdf' });
        // Choose a directory (you can adjust this based on your needs)
        // Generate a unique filename (you can use any logic here)
        const fileName = 'CommitteeCalculator.pdf';
        this.file.writeFile(this.file.externalDataDirectory, fileName, blob, { replace: true }).then(fileEntry => {
        FileOpener.open(this.file.externalDataDirectory+fileName, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      });
      this.sharePdf(this.file.externalDataDirectory+fileName)
    }catch(e){
      console.log(e)
    }
      } else {
        console.error('Error generating PDF buffer: No data.');
      }
    });
  }

  private async fetchImageContent(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();
      const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      return base64Image;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  }

  sharePdf(filePath: string) {
    const fileName = 'dummy.pdf';
    const contentType = 'application/pdf';
   
    this.file.checkFile(this.file.externalDataDirectory, fileName)
       .then(() => {
        alert('tsts')
         Share.share({
           title: 'Share PDF',
           url: 'file://' + filePath,
           dialogTitle: 'Share PDF'
         });
       })
       .catch(e => console.log('Error opening file', e));
   }

   generateTable() {
    const datePipeData = new DatePipe('en-US');
    const table = {
      headerRows: 1,
      widths: ['30%', '30%'], // Set the table width to 50%
      body: [
        [this.resourceKeyValue('NewCommittee_lbl_total_committee_amount'), this.totalCommitteePrice.toString()],
        [this.resourceKeyValue('NewCommittee_lbl_totalmonths_of_committee'), this.totalNumberofMonth.toString()],
        [this.resourceKeyValue('NewCommittee_lbl_total_members'), this.totalMember.toString()],
        [this.resourceKeyValue('NewCommittee_lbl_price_per_member'), this.perHeadCommittee.toString()],
        [this.resourceKeyValue('NewCommittee_lbl_starting_date'), datePipeData.transform(this.startDate, 'dd-MM-yyyy').toString()],
        [this.resourceKeyValue('NewCommittee_lbl_end_date'),datePipeData.transform(this.endDate, 'dd-MM-yyyy').toString()]
      ],
    };
  
    return table;
  }



}
