import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoanService } from 'src/app/services/loan.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-payment-schedule-list',
  templateUrl: './payment-schedule-list.page.html',
  styleUrls: ['./payment-schedule-list.page.scss'],
})
export class PaymentScheduleListPage implements OnInit {

  loanDetails: any = null;
  paymentSchedule: any[] = [];
  loanID: string;
  userId:string;
  isLoading: boolean = true; // Initially set to true
  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService,
    private navCtrl: NavController,
    private _storageService:StorageService,
    public util: UtilService
  ) {
    this._storageService.get('token').then(data => {
      if (data) {
        let currentDateTime: any = new Date().getTime();
        let expiryDateTime = new Date(data.expirationDate).getTime();
        if (currentDateTime <= expiryDateTime) {
          this._storageService.get('loginUserDetails').then((res: any) => {
            if (res) {
              this.userId = res.encryptUserId;
              this.route.queryParams.subscribe(params => {
                if (params && params['loanID']!=null) {
                  this.fetchLoanDetails(params['loanID']);
                } else {
                  this.navCtrl.back();
                }
              });
            }
          });
        } else {
          this.navCtrl.navigateRoot(['/login']);
        }
      } else {
        this.navCtrl.navigateRoot(['/login']);
      }
    });
  }

  ngOnInit() {
  }

  fetchLoanDetails(loanID: string) {
    this.isLoading=true;
    this.loanService.GetLoanPaymentScheduleByLoanId(loanID).subscribe(response => {
        if (response && response.length > 0) {
          // Check and parse the first array (loan details)
          if (response[0] && response[0].length > 0) {
            const loanData:any = JSON.parse(response[0]); // First array
            this.loanDetails=loanData[0];
          } else {
            this.loanDetails = []; // or handle it appropriately if it's null or empty
          }

          if (response[1] && response[1].length > 0) {
            const paymentScheduleData:any = JSON.parse(response[1]); // First array
            this.paymentSchedule=paymentScheduleData;
          } else {
            this.paymentSchedule = []; // or handle it appropriately if it's null or empty
          }

        } else {
          this.loanDetails=[];
          this.paymentSchedule=[];
        }
        this.isLoading=false;
    }, error => {
      this.isLoading=false;
      this.util.showErrorAlert("An error occurred while fetching loan details. Please try again later.");
    });
  }
  

  updatePayment(payment: any) {
    // Navigate to Update Payment page with selected payment details
    this.navCtrl.navigateForward(['/update-payment'], { queryParams: { paymentId: payment.EncyptScheduleID } });
  }

  viewPaymentHistory(payment: any) {
    // Navigate to Payment History page with selected payment details
    this.navCtrl.navigateForward(['/payment-history'], { queryParams: { paymentId: payment.EncyptScheduleID  } });
  }

  goToBack() {
    this.navCtrl.back();
  }
  
}
