import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { BackgroundService } from 'src/app/services/background.service';
import { LoanService } from 'src/app/services/loan.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.page.html',
  styleUrls: ['./loan-list.page.scss'],
})
export class LoanListPage implements OnInit {

  loans: any[] = [];
  userId:any;
  isLoading = true;
  ownLoanList:any[]=[];
  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService, // Service to fetch loan details
    private navCtrl: NavController,
    public util: UtilService,
    private _storageService: StorageService,
    private alertCtrl: AlertController,
    private _backgroundService:BackgroundService
  ) {
    this._storageService.get('token').then(data => {
      if (data) {
        let currentDateTime: any = new Date().getTime();
        let expiryDateTime = new Date(data.expirationDate).getTime();
        if (currentDateTime <= expiryDateTime) {
          this._storageService.get('loginUserDetails').then((res: any) => {
            if (res) {
              this.userId = res.encryptUserId;
              this.fetchLoans(this.userId);
              this._backgroundService.fetchLoanDataFromAPI(this.userId);
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

  fetchLoans(userId:any) {
    this.loanService.getLoanList(userId).subscribe({
      next:(data)=>{
        if(data !=null && data.length>0){
          if (data[0] && data[0].length > 0) {
            this.loans = JSON.parse(data[0]); // First array
          } else {
            this.loans = []; // or handle it appropriately if it's null or empty
          }
  
           // Check and parse the third array (loan documents)
          if (data[1] && data[1].length > 0) {
            this.ownLoanList = JSON.parse(data[1]); // Third array
          } else {
            this.ownLoanList = []; // or handle it appropriately if it's null or empty
          }

          this.isLoading = false;
        }
        else{
          this.loans=[];
        }
    },
    error:(e)=>{
    this.isLoading = false;
    this.util.showErrorAlert("An error occurred while fetching loan details. Please try again later.");
    },
    complete:()=>{
      this.isLoading = false;
    }
  });
  }

  viewLoanDetails(loanId: string) {
    this.navCtrl.navigateForward(['/loan-detail-by-id'], { queryParams: { loanId: loanId } });
  }

  createNewLoan() {
    this.navCtrl.navigateForward('/create-new-loan');
  }

  async onLoanStatusChange(loan: any) {
    if (loan.LoanStatus === 'Closed') {
      // First confirmation dialog
      const alert = await this.alertCtrl.create({
        header: 'Confirm',
        message: 'Are you sure you want to close this loan? This action cannot be undone.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // Revert status back to 'Active'
              loan.LoanStatus = 'Active';
            },
          },
          {
            text: 'Confirm',
            handler: async () => {
              try {
                // Check for pending installments from the database
                const pendingInstallmentsData = await this.loanService.GetCountPendingInstallment(loan.EncyptLoanId, this.userId);
  
                if (pendingInstallmentsData != null && pendingInstallmentsData.pendingInstallments > 0) {
                  // Show warning if installments are pending
                  const warning = await this.alertCtrl.create({
                    header: 'Pending Installments',
                    message: `There are ${pendingInstallmentsData.pendingInstallments} pending installments. Do you still want to close this loan?`,
                    buttons: [
                      {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                          // Revert the status back to 'Active'
                          loan.LoanStatus = 'Active';
                        }
                      },
                      {
                        text: 'Proceed to Close',
                        handler: async () => {
                          // Proceed to close loan even with pending installments
                          await this.closeLoan(loan);
                        }
                      }
                    ]
                  });
                  await warning.present();
                } else {
                  // If no pending installments, proceed to close the loan directly
                  await this.closeLoan(loan);
                }
              } catch (error) {
                console.error('Error checking pending installments', error);
                // Handle potential errors in fetching pending installments
              }
            },
          },
        ],
      });
      await alert.present();
    }
  }
  
  // Helper function to close the loan
  private async closeLoan(loan: any) {
    this.loanService.closeLoan(loan.EncyptLoanId, this.userId).subscribe({
      next: async (response) => {
        if(response!=null){
          if(response.status=="Success")
          {
            this.fetchLoans(this.userId);
        // Show success message if loan closed successfully
        await this.util.showSimpleAlert(response.message); 
      } 
      else{
        await this.util.showErrorAlert(response.message); 
      }
        // Ensure the status is set to 'Closed'
        loan.LoanStatus = 'Closed';

        }
      },
      error: async (err) => {
        await this.util.showErrorAlert(err.error?.Message || 'An error occurred while closing the loan.');
        // Revert the status back to 'Active' in case of error
        loan.LoanStatus = 'Active';
      }
    });
  }

  onSelectClick(event: Event) {
    // Prevent click event from propagating to the ion-card element
    event.stopPropagation();
  }
  
  

}
