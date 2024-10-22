import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { applicationObject, responseEnum, statusEnum } from 'src/app/model/applicationEnum';
import { committeeModel } from 'src/app/model/committee-model';
import { loginUserDetails } from 'src/app/model/common-model';
import { userRegistrationModel } from 'src/app/model/userRegistration-model';
import { CommitteeService } from 'src/app/services/committee.service';
import { CommonService } from 'src/app/services/common.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-add-new-committee',
  templateUrl: './add-new-committee.page.html',
  styleUrls: ['./add-new-committee.page.scss'],
})
export class AddNewCommitteePage implements OnInit {

resourceData:any;
isSubmitted :boolean= false;
userForm: FormGroup;
countryList:any;

committeeForm: FormGroup;
isPenaltyAmount:boolean=false;
objdata=new committeeModel();
isReadonly:true;
userId:string;
minDate: string;
currentDate: string;

taskName = '';
  projectName = '';
  teamsList = ['Designer team', 'Developer team', 'HR team', 'Marketing team', 'Management team'];
  selectedTeam = '';
  selectedTeamMembers: any = [];
  keyboardHeight: any;
  openCalendarModal = false;
  displayDate = moment().utc().format('DD/MM/YYYY');
  selectedDate: any;
  dateSelectionFor = '';
  selectedStartDate: any;
  selectedEndDate: any;
  showAttachmentSheet = false;
  from: any;

  constructor(
    public util: UtilService,
    private _storageService:StorageService,
    private _language:LanguageService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private navCtrl: NavController,
    private _committeeService:CommitteeService,
    public platform: Platform
  ) {
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0]; // Current Date

    // Set minimum date (e.g., today's date)
    this.minDate = today.toISOString().split('T')[0]; 
    this._storageService.get(applicationObject.token).then(data => {
      if(data){
        let currentDateTime:any= new Date().getTime();
        let expiryDateTime=new Date(data.expirationDate).getTime();
        if(currentDateTime<=expiryDateTime)
        {
          this._storageService.get(applicationObject.loginUserDetails).then((res:loginUserDetails) => {
            if(res) {
              this.userId=res.encryptUserId;
              this._storageService.get(applicationObject.resourceData).then((data: any) => {
                if (data) {
                  this.resourceData=data;
                } 
                else
                this.resourceData=null;
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

  resourceKeyValue(key:string){
    return  this._language.filterAndGetValueByKey(this.resourceData,key);
  }


  ngOnInit() {
    this.committeeForm = this.formBuilder.group({
      committeeHolderName: ['', Validators.required],
      totalCommitteeAmount: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      totalMembers: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      pricePerMember: [0], // initially disabled
      totalMonths: [0], // initially disabled
      startingDate: [this.getCurrentDate(), Validators.required],
      endDate: [this.getCurrentDate()], // initially disabled
      bufferDays: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      applyPenalty: [false], // Boolean control
      penaltyAmount: [0], // initially disabled,
      numberofCommittee: [0], 
      frequencyType: [1], 
      submitButton: { value: false, disabled: true }
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onStartingDateSelected(event: Event) {
      let startDate:any=this.datepipe.transform(this.committeeForm.value.startingDate, 'dd-MMM-yyyy');
      var start_Date = moment(startDate);
      if(this.committeeForm.value.totalMembers!=null && this.committeeForm.value.totalMembers>0){
      this.committeeForm.patchValue({
        endDate:this.datepipe.transform(moment(start_Date).add(this.committeeForm.value.totalMembers, 'months').calendar(), 'yyyy-MM-dd')
      })
    }
  }

  onTotalMemberChange(event: Event){
    let inputElement :any= event.target as HTMLInputElement;
    if(inputElement.value!="" && inputElement.value>0 &&  this.committeeForm.value.totalCommitteeAmount!="" && this.committeeForm.value.totalCommitteeAmount!=null && this.committeeForm.value.totalCommitteeAmount>0)
    {
      const totalPrice =this.committeeForm.value.totalCommitteeAmount;
      const totalMonths = this.committeeForm.value.totalMembers;

      let startDate:any=this.datepipe.transform(this.committeeForm.value.startingDate, 'dd-MMM-yyyy');
      var start_Date = moment(startDate);
      if(this.committeeForm.value.totalMembers!=null && this.committeeForm.value.totalMembers>0){
      this.committeeForm.patchValue({
        endDate:this.datepipe.transform(moment(start_Date).add(this.committeeForm.value.totalMembers, 'months').calendar(), 'yyyy-MM-dd')
      })
    }
  
      if (totalPrice !== null && totalMonths !== null && totalMonths !== 0) {
        const perCommitteePrice = totalPrice / totalMonths;
        this.committeeForm.patchValue({
          pricePerMember:perCommitteePrice.toFixed(2),
          totalMonths:totalMonths
        })
      } else {
        this.committeeForm.patchValue({
          perCommitteePrice:0,
          totalMonths:inputElement.value
        })
      }
    }
    else{
      this.committeeForm.patchValue({
        pricePerMember:0,
        totalMonths:inputElement.value
      })
    }
  }

  onTotalCommitteeChange(event: Event){
    let inputElement :any= event.target as HTMLInputElement;
    if(inputElement.value!="" && inputElement.value>0 &&  this.committeeForm.value.totalMembers!="" && this.committeeForm.value.totalMembers!=null && this.committeeForm.value.totalMembers>0)
    {
      const totalPrice =this.committeeForm.value.totalCommitteeAmount;
      const totalMonths = this.committeeForm.value.totalMembers;

      let startDate:any=this.datepipe.transform(this.committeeForm.value.startingDate, 'dd-MMM-yyyy');
      var start_Date = moment(startDate);
      if(this.committeeForm.value.totalMembers!=null && this.committeeForm.value.totalMembers>0){
      this.committeeForm.patchValue({
        endDate:this.datepipe.transform(moment(start_Date).add(this.committeeForm.value.totalMembers, 'months').calendar(), 'dd-MM-yyyy')
      })
    }
  
      if (totalPrice !== null && totalMonths !== null && totalMonths !== 0) {
        const perCommitteePrice = totalPrice / totalMonths;
        this.committeeForm.patchValue({
          pricePerMember:perCommitteePrice.toFixed(2),
          totalMonths:totalMonths
        })
      } else {
        this.committeeForm.patchValue({
          perCommitteePrice:0,
          totalMonths:0
        })
      }
    }
    else{
      this.committeeForm.patchValue({
        pricePerMember:0,
        totalMonths:0
      })
    }
  }

  onApplyPenaltyChange() {
    this.committeeForm.patchValue({
      penaltyAmount:0
    })
    this.isPenaltyAmount=!this.isPenaltyAmount;
  }

  
  onSubmit():any {
    if (!this.committeeForm.valid) {
      return false;
    }
    
    const numberOfOwnCommittee = this.committeeForm.value.numberOfOwnCommittee;
    const totalMonths = this.committeeForm.value.totalMonths;
  
    // Validate if numberOfOwnCommittee is smaller than totalMonths
    if (numberOfOwnCommittee >= totalMonths) {
      // Show an error message or handle the error
      this.util.showErrorAlert('Number of own committee must be smaller than total months!');
      return; // Stop further processing
    }


      this.isSubmitted=true;  
      //this._commonService.showLoader();
      this.objdata.committeeId =0 ;
      this.objdata.holderName=this.committeeForm.value.committeeHolderName;
      this.objdata.totalCommitteeAmount=parseFloat(this.committeeForm.value.totalCommitteeAmount);
      this.objdata.totalMember=this.committeeForm.value.totalMembers;
      this.objdata.pricePerMemberCommittee=parseFloat(this.committeeForm.value.pricePerMember);
      this.objdata.totalMonthsOfCommittee =this.committeeForm.value.totalMonths;
      this.objdata.startDate=this.committeeForm.value.startingDate;
      this.objdata.endDate =this.committeeForm.value.endDate;
      this.objdata.bufferDays=this.committeeForm.value.bufferDays;
      this.objdata.isBufferDaysForPayments =this.committeeForm.value.applyPenalty;
      this.objdata.penaltyAmount =parseFloat(this.committeeForm.value.penaltyAmount);
      this.objdata.numberOfOwnCommittee =this.committeeForm.value.numberOfOwnCommittee;
      this.objdata.frequencyType =this.committeeForm.value.frequencyType;
      this.objdata.status =statusEnum.Pending;
      this.objdata.createdBy=this.userId;
      this.objdata.action ="save";
      this._committeeService.saveUpdateCommitteeDetails(this.objdata).subscribe({
      next:(data)=>{
        if(data !=null && data.length>0 && data[0].errorNumber==responseEnum.success){
            this.resetForm();
            this.util.showSimpleAlert(this.resourceKeyValue("DatabaseMsg_committee_created_successfully"))
            this.isSubmitted=false;  
            this.navCtrl.navigateRoot(['/committee-list']);
        }
        else{
          this.isSubmitted=false;  
          this.util.showErrorAlert(this.resourceKeyValue("DatabaseMsg_committee_already_exists"))
        }
        //this._commonService.hideLoader();
    },
    error:(e)=>{
      this.isSubmitted=false;  
     // this._commonService.hideLoader();
    },
    complete:()=>{
      this.isSubmitted=false;  
     // this._commonService.hideLoader();
    }
  });

  }

  resetForm(){
    this.committeeForm.reset();
    this.committeeForm.patchValue({
      pricePerMember:"",
      totalMonths:"",
      startingDate:this.getCurrentDate()
    })
  }


  ionViewWillEnter() {
    if (Capacitor.isNativePlatform()) {
    Keyboard.addListener('keyboardWillShow', info => {
      this.keyboardHeight = info.keyboardHeight;
    });

    Keyboard.addListener('keyboardWillHide', () => {
      this.keyboardHeight = 0;
    });
  }
  }

  goToInviteMembers(inviteFor: any, memberFor: any) {
    let info = { inviteFor: inviteFor, memberFor: memberFor }
    //this.router.navigate(['/', 'invite-members', JSON.stringify(info)])
  }

  ionViewDidLeave() {
    if (Capacitor.isNativePlatform()) {
    Keyboard.removeAllListeners();
    }
  }

  onDateSelected(event: any) {
    // Get the selected date from ion-datetime
    this.selectedDate = event.detail.value;
    this.selectedStartDate = this.datepipe.transform(this.selectedDate, 'dd-MMM-yyyy');
    this.applySelectedDate();
  }

  applySelectedDate() {
    if (this.selectedStartDate) {
      // Patch the starting date to the form control manually
      this.committeeForm.patchValue({
        startingDate: this.datepipe.transform(new Date(this.selectedDate), 'yyyy-MM-dd'),
      });

      // If totalMonths is present, calculate the end date
      const startDate = moment(this.selectedDate); // moment object
      if (this.committeeForm.value.totalMonths && this.committeeForm.value.totalMonths > 0) {
        // Add totalMonths to the starting date and convert to Date object
        const calculatedEndDate = moment(startDate).add(this.committeeForm.value.totalMonths, 'months').toDate();
        
        // Update the form's end date
        this.committeeForm.patchValue({
          endDate: this.datepipe.transform(calculatedEndDate, 'yyyy-MM-dd'),
        });
      }

      // Close the modal
      this.openCalendarModal = false;
    }
  }

  selectedFrequency: string = 'monthly'; // Track selected gender ('male' or 'female')

  // Method to select gender
  selectFrequency(frequency: string) {
    this.userForm.get('gender')?.setValue(frequency=="monthly"?1:2);
    this.selectedFrequency = frequency;
  }
  
  }
  