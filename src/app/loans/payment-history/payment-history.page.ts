import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoanService } from 'src/app/services/loan.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {
  loanId: number;
  paymentHistory: any[] = [];
  isLoading = true;
  constructor(private loanService: LoanService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  private _storageService:StorageService,
private util:UtilService) {
      this._storageService.get('token').then(data => {
        if (data) {
          let currentDateTime: any = new Date().getTime();
          let expiryDateTime = new Date(data.expirationDate).getTime();
          if (currentDateTime <= expiryDateTime) {
            this._storageService.get('loginUserDetails').then((res: any) => {
              if (res) {

                this.route.queryParams.subscribe(params => {
                  if (params && params['paymentId']!=null) {
                    this.fetchPaymentHistory(params['paymentId']);
                  } else {
                 //   this.navCtrl.navigateRoot(['/loans']); // Redirect if no loanId is provided
                  }
                });
              }
            });
          } else {
            //this.navCtrl.navigateRoot(['/login']);
          }
        } else {
          this.navCtrl.navigateRoot(['/login']);
        }
      });
     }

  ngOnInit() {
  }

  fetchPaymentHistory(ScheduleId: string) {
    this.isLoading=true;
    this.loanService.GetPaymentHistoryByScheduleID(ScheduleId).subscribe(response => {
        this.isLoading = false; // Stop the loader when the data is fetched
  
        if (response && response.length > 0) {
          this.paymentHistory = response; // Populate the payment history
        } else {
          this.paymentHistory = []; // Handle no data case
        }
    }, error => {
      this.util.showSimpleAlert('An error occurred while applying payment.')
      this.isLoading = false; // Stop the loader on error
    });
  }

  goToBack() {
    this.navCtrl.back();
  }

}
