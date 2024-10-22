import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoanService } from 'src/app/services/loan.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  paymentForm: FormGroup;
  installment: any; // Assume this is provided or fetched elsewhere
  isLoading: boolean = false;
  userId:string;
  minDate: string;
  isSpinerLoader:boolean=false;
  constructor(
    public util: UtilService,
    private fb: FormBuilder,
    private paymentService: LoanService,
    private navCtrl: NavController,
    private _storageService:StorageService,
    private route: ActivatedRoute
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
                if (params && params['paymentId']!=null) {
                  this.getScheduledPayments(params['paymentId'],this.userId)
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
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Prevent past date selection

    this.paymentForm = this.fb.group({
      paymentAmount: ["", [Validators.required, Validators.min(1)]],
      paymentMethod: ['Cash', [Validators.required]],
      paymentStatus: ["", [Validators.required]], // Full or Partial payment
      lateFee: [0, [Validators.min(0)]],  // Only for partial payment
      adjustToNextEMI: [false],  // Whether to adjust to the next EMI
      nextPaymentDate: [null],  // Next payment date (only for partial)
      remarks: ['']
    });

    this.paymentForm.get('paymentStatus')?.valueChanges.subscribe(value => {
      if (value === 'Full') {
        this.paymentForm.get('lateFee')?.clearValidators();
        this.paymentForm.get('adjustToNextEMI')?.setValue(false);
      } else {
        this.paymentForm.get('lateFee')?.setValidators([Validators.required, Validators.min(0)]);
      }
      this.paymentForm.get('lateFee')?.updateValueAndValidity();
      this.validatePayment();
    });

    this.paymentForm.get('paymentAmount').valueChanges.subscribe(() => {
      this.validatePayment();
    });
    
  }



  getScheduledPayments(ScheduleId:string,userId:string){
    this.isLoading = true;
  this.paymentService.getScheduledPaymentsByScheduleID(ScheduleId,userId).subscribe({
    next: (data) => {
      if(data!=null && data.length>0)
      {
        this.installment=data[0];
      }
      else{
        this.installment=null;  
      }
      this.isLoading = false; 
    },
    error: (e) => {
      this.isLoading = false; 
      this.installment=null;
    },
    complete: () => {
      
    }
  });
}


validatePayment() {
  const paymentAmount = this.paymentForm.get('paymentAmount').value;
  const status = this.paymentForm.get('paymentStatus').value;
  const dueAmount = this.installment.BalanceRemaining;

  // Reset validation errors before re-validating
  this.paymentForm.get('paymentAmount').setErrors(null);

  // Full payment validation: paymentAmount must be >= dueAmount
  if (status === 'Full' && paymentAmount < dueAmount) {
    this.paymentForm.get('paymentAmount').setErrors({ insufficientAmount: true });
  }

  // Partial payment validation: paymentAmount must be <= dueAmount
  if (status === 'Partial' && paymentAmount > dueAmount) {
    this.paymentForm.get('paymentAmount').setErrors({ excessAmount: true });
    this.paymentForm.get('lateFee').reset();
    this.paymentForm.get('nextPaymentDate').reset();
  }
  this.paymentForm.patchValue({
    lateFee:0
  })
}

  applyPayment() {
    if (this.paymentForm.invalid) return;

    this.isSpinerLoader = true;

    const paymentData = {
      ScheduleID: this.installment.EncyptScheduleID,
      PaymentAmount: this.paymentForm.value.paymentAmount,
      PaymentDate: new Date(),
      PaymentMethod: this.paymentForm.value.paymentMethod,
      PaymentStatus: this.paymentForm.value.paymentStatus,
      NextPaymentDate: this.paymentForm.value.adjustToNextEMI ? null : this.paymentForm.value.nextPaymentDate,
      Remarks: this.paymentForm.value.remarks,
      LateFeeAdjustment: this.paymentForm.value.lateFee,
      AdjustRemainingToNextEMI:this.paymentForm.value.adjustToNextEMI,
      UserID: this.userId, // Replace with actual user ID
      IP: '' // Replace with actual IP
    };

    this.paymentService.saveLoanPayment(paymentData).subscribe({
      next: (response) => {
        console.log(response)
        if (response && response[0].ErrorCode == 1) {
          this.util.showSimpleAlert("Payment applied successfully!")
          setTimeout(() => {
            this.navCtrl.back();
          }, 1000);
        } else {
          this.util.showSimpleAlert('Failed to apply payment: ' + response[0].ErrorMessage)
        }
        this.isSpinerLoader = false;
      },
      error: (error) => {
        this.util.showSimpleAlert('An error occurred while applying payment.')
        this.isSpinerLoader = false;
      }
    });
  }

  viewPaymentHistory() {
    // Navigate to payment history page
    this.navCtrl.navigateForward('/payment-history', {
      queryParams: { paymentId: this.installment.EncyptScheduleID }
    });
  }

  goToBack() {
    this.navCtrl.back();
  }

}
