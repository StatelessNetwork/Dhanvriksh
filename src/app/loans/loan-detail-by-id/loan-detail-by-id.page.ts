import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoanService } from 'src/app/services/loan.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-loan-detail-by-id',
  templateUrl: './loan-detail-by-id.page.html',
  styleUrls: ['./loan-detail-by-id.page.scss'],
})
export class LoanDetailByIdPage implements OnInit {
  loan: any;
  loanDocuments: any[] = [];
  userId: string;
  isLoading: boolean = true; // Initially set to true
  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService, // Service to fetch loan details
    private navCtrl: NavController,
    public util: UtilService,
    private _storageService: StorageService
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
                if (params && params['loanId']!=null) {
                  this.fetchLoanDetails(params['loanId']);
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
  fetchLoanDetails(loanId: string) {
    this.isLoading=true;
    this.loanService.getLoanDetailsById(loanId, this.userId).subscribe(response => {
      this.isLoading=false;
        if (response && response.length > 0) {
          // Check and parse the first array (loan details)
          if (response[0] && response[0].length > 0) {
            const loanData:any = JSON.parse(response[0]); // First array
            this.loan=loanData[0];
          } else {
            this.loan = []; // or handle it appropriately if it's null or empty
          }
  
           // Check and parse the third array (loan documents)
          if (response[1] && response[1].length > 0) {
            this.loanDocuments = JSON.parse(response[1]); // Third array
          } else {
            this.loanDocuments = []; // or handle it appropriately if it's null or empty
          }
        } else {
          this.loan=[];
          this.loanDocuments=[];
        }
        this.isLoading=false;
    }, error => {
      this.isLoading=false;
      this.util.showErrorAlert("An error occurred while fetching loan details. Please try again later.");
    });
  }
  
  getDocumentUrl(documentPath: string): string {
    // Assuming documentPath is like "C:\\uploads\\document.pdf"
    const fileName = documentPath.split('\\').pop(); // Get the file name
    return `http://localhost:47293/uploads/${fileName}`;
  }

  viewPaymentSchedule() {
    this.navCtrl.navigateForward(['/payment-schedule-list'], { queryParams: { loanID: this.loan.EncyptLoanId } });
  }

  goToBack() {
    this.navCtrl.back();
  }
}
