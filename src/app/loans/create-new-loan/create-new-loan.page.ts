import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { responseEnum } from 'src/app/model/applicationEnum';
import { LoanModel } from 'src/app/model/LoanModel';
import { LoanService } from 'src/app/services/loan.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-create-new-loan',
  templateUrl: './create-new-loan.page.html',
  styleUrls: ['./create-new-loan.page.scss'],
})
export class CreateNewLoanPage implements OnInit {

  isSubmitted: boolean = false;
  loanForm: FormGroup;
  showInterestRate: boolean = true;
  showFixedInterestAmount: boolean = false;
  userId: string;
  minDate: string;
  memberId: string;
  isInterestPeriodDisabled: boolean = false; 
  currentStep = 1;
  currentStepTitle = 'Basic Loan Details';
  files: (File | any)[] = [];  // Stores the file paths or URIs
  uploadedFileUrls: string[] = []; // URLs of uploaded files
  maxFileSizeMB = 2;
  allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];

  constructor(
    public util: UtilService,
    private _storageService: StorageService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private navCtrl: NavController,
    private _loanService: LoanService
  ) {
    
    this._storageService.get('token').then(data => {
      if (data) {
        let currentDateTime: any = new Date().getTime();
        let expiryDateTime = new Date(data.expirationDate).getTime();
        if (currentDateTime <= expiryDateTime) {
          this._storageService.get('loginUserDetails').then((res: any) => {
            if (res) {
              this.userId = res.encryptUserId;
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
    this.minDate = this.getCurrentDate();
    this.loanForm = this.formBuilder.group({
      memberID: ['', Validators.required],
      loanAmount: [null, [Validators.required, Validators.pattern(/^\d+$/)]],
      interestType: ['Simple', Validators.required],
      interestRate: [null],
      interestPeriod: ['Monthly', Validators.required],
      emiType: ['EMI', Validators.required],
      tenure: [null, Validators.required],
      tenureType: ['Months', Validators.required], // New field for Tenure Type
      paymentFrequency: [1, Validators.required], // Default value set to 1
      fixedInterestAmount: [null],
      startDate: [this.getCurrentDate(), Validators.required],
      loanStatus: ['Active', Validators.required]
    }, { validators: this.paymentFrequencyValidator });

    this.updateValidators('Simple');

    // Subscribe to value changes for relevant form controls
    this.loanForm.get('loanAmount').valueChanges.subscribe(() => this.onFormValuesChanged());
    this.loanForm.get('interestRate').valueChanges.subscribe(() => this.onFormValuesChanged());
    this.loanForm.get('fixedInterestAmount').valueChanges.subscribe(() => this.onFormValuesChanged());
    this.loanForm.get('tenure').valueChanges.subscribe(() => this.onFormValuesChanged());
    this.loanForm.get('interestType').valueChanges.subscribe((interestType) => {
      this.updateValidators(interestType);
      this.onFormValuesChanged();
    });
    this.loanForm.get('interestPeriod').valueChanges.subscribe(() => this.onFormValuesChanged());
    this.loanForm.get('emiType').valueChanges.subscribe(() => this.onFormValuesChanged());
    this.loanForm.get('paymentFrequency').valueChanges.subscribe(() => this.onFormValuesChanged());
    this.loanForm.get('tenureType').valueChanges.subscribe(() => this.onFormValuesChanged()); // Handle tenure type changes

    this.updateStepTitle();
  }

  paymentFrequencyValidator(control: AbstractControl): ValidationErrors | null {
    const tenure = control.get('tenure')?.value;
    const paymentFrequency = control.get('paymentFrequency')?.value;

    if (tenure && paymentFrequency && paymentFrequency > tenure) {
      return { paymentFrequencyExceedsTenure: true };
    }

    return null;
  }

  nextStep() {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
      this.updateStepTitle();
    }
  }

  prevStep() {
    this.currentStep--;
    this.updateStepTitle();
  }

  updateStepTitle() {
    switch (this.currentStep) {
      case 1:
        this.currentStepTitle = 'Basic Loan Details';
        break;
      case 2:
        this.currentStepTitle = 'Loan Period & Interest';
        break;
      case 3:
        this.currentStepTitle = 'Document Upload';
        break;
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.loanForm.get('memberID')?.valid && this.loanForm.get('loanAmount')?.valid && this.loanForm.get('interestType')?.valid;
      case 2:
        return this.loanForm.get('interestRate')?.valid && this.loanForm.get('interestPeriod')?.valid && this.loanForm.get('emiType')?.valid &&
               this.loanForm.get('tenure')?.valid && this.loanForm.get('tenureType')?.valid && this.loanForm.get('paymentFrequency')?.valid;
      case 3:
        return this.files.length > 0; // Ensure at least one file is selected
      default:
        return false;
    }
  }

  onFormValuesChanged() {
    // Logic to handle form value changes if needed
  }

  onInterestTypeChange(event: any) {
    const interestType = event.detail.value;
    this.updateValidators(interestType);
    if (interestType === 'Fixed') {
      this.loanForm.patchValue({ interestPeriod: 'Days' });
      this.loanForm.patchValue({ tenureType: 'Days' });
      this.isInterestPeriodDisabled = true;  // Disable interest period dropdown
    } else {
      this.loanForm.patchValue({ interestPeriod: 'Monthly' });
      this.loanForm.patchValue({ tenureType: 'Months' });
      this.isInterestPeriodDisabled = false; // Enable interest period dropdown for other types
    }
    this.onFormValuesChanged();
  }

  updateValidators(interestType: string) {
    const interestRateControl = this.loanForm.get('interestRate');
    const fixedInterestAmountControl = this.loanForm.get('fixedInterestAmount');

    if (interestType === 'Fixed') {
      interestRateControl.setValue(0);
      interestRateControl.clearValidators();
      fixedInterestAmountControl.setValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]);

      this.showInterestRate = false;
      this.showFixedInterestAmount = true;
    } else {
      fixedInterestAmountControl.setValue(0);
      fixedInterestAmountControl.clearValidators();
      interestRateControl.setValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]);

      this.showInterestRate = true;
      this.showFixedInterestAmount = false;
    }

    interestRateControl.updateValueAndValidity();
    fixedInterestAmountControl.updateValueAndValidity();
  }

  getAdjustedTenure(tenure: number, tenureType: string): number {
    if (tenureType === 'Years') {
      return tenure * 12; // Convert years to months
    } else if (tenureType === 'Days') {
      return tenure; // Use days as is
    }
    return tenure; // Default to months
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): any {
    if (!this.loanForm.valid) {
      this.loanForm.markAllAsTouched();
      return false;
    }

    this.isSubmitted = true;

    const loanDetails = new LoanModel({
      LoanID: 0,
      MemberID: this.memberId,
      LoanAmount: this.loanForm.value.loanAmount,
      InterestType: this.loanForm.value.interestType,
      InterestRate: this.loanForm.value.interestRate,
      FixedInterestAmount: this.loanForm.value.fixedInterestAmount,
      InterestPeriod: this.loanForm.value.interestPeriod,
      EMIType: this.loanForm.value.emiType,
      Tenure: this.loanForm.value.tenure,
      TenureType: this.loanForm.value.tenureType, // Include Tenure Type
      PaymentFrequency: this.loanForm.value.paymentFrequency,
      StartDate: this.loanForm.value.startDate,
      LoanStatus: this.loanForm.value.loanStatus,
      IP: '',
      UserId: this.userId
    });

    this._loanService.saveLoanDetails(loanDetails).subscribe({
      next: (data) => {
        if (data != null && data.length > 0 && data[0].ErrorCode == responseEnum.success) {
          if (this.files.length > 0) {
          this.uploadFiles(data[0].EncyptLoanId , this.userId);
          }
          else{
            this.resetForm();
            this.util.showSimpleAlert("Loan created successfully");
            this.isSubmitted = false;
            setTimeout(() => {
              this.navCtrl.navigateRoot(['/loan-detail-by-id'], { queryParams: { loanId: data[0].EncyptLoanId } });
            }, 500);
          }
        } else {
          this.isSubmitted = false;
          this.util.showErrorAlert(data[0].errorMessage);
        }
      },
      error: (e) => {
        this.isSubmitted = false;
      },
      complete: () => {
        this.isSubmitted = false;
      }
    });
  }

  resetForm() {
    this.loanForm.reset();
    this.loanForm.patchValue({
      startDate: this.getCurrentDate(),
      paymentFrequency: 1,
      interestPeriod: 'Monthly',
      interestType: 'Simple',
      emiType: 'EMI',
      tenureType: 'Months',
      loanStatus: 'Active'
    });

    this.updateValidators('Simple');
  }

  onMemberSelected(member: any) {
    this.memberId = member.Id;
    console.log('Selected Member:', member);
  }

  get memberIDControl(): FormControl {
    return this.loanForm.get('memberID') as FormControl;
  }

  // Upload Document
  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
      });

      const blob = await this.fetchFileAsBlob(image.webPath!);
      const file = new File([blob], `image_${new Date().getTime()}.jpg`, { type: blob.type });

      if (this.validateFile(file)) {
        this.files.push(file);
      } else {
        this.util.showErrorAlert("Invalid file type or file size exceeds 2MB.");
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  selectFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files) as File[];

      selectedFiles.forEach((file) => {
        if (this.validateFile(file)) {
          this.files.push(file);
        } else {
          this.util.showErrorAlert(`File "${file.name}" is either not a valid type or exceeds the size limit of 2MB.`);
        }
      });
    }
  }

  private validateFile(file: File): boolean {
    const isValidType = this.allowedFileTypes.includes(file.type);
    const isValidSize = file.size / 1024 / 1024 <= this.maxFileSizeMB;
    return isValidType && isValidSize;
  }

  

  private async fetchFileAsBlob(fileOrUrl: File | string): Promise<Blob> {
    if (typeof fileOrUrl === 'string') {
      const response = await fetch(fileOrUrl);
      return response.blob();
    } else {
      return fileOrUrl;
    }
  }

  private getFileExtension(fileOrUrl: File | string): string {
    if (typeof fileOrUrl === 'string') {
      const mimeType = fileOrUrl.split(';')[0].split(':')[1];
      return this.mapMimeTypeToExtension(mimeType);
    } else if (fileOrUrl instanceof File) {
      const fileName = fileOrUrl.name;
      const extension = fileName.split('.').pop();
      return extension ? `.${extension}` : '';
    }
    return '';
  }

  private mapMimeTypeToExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'application/pdf':
        return '.pdf';
      default:
        return '';
    }
  }

  async uploadFiles(loanId:string,userId:any) {
    if (this.files.length === 0) {
      alert('Please select or capture files first.');
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      const fileOrUrl = this.files[i];
      const blob = await this.fetchFileAsBlob(fileOrUrl);
      const fileExtension = this.getFileExtension(fileOrUrl);
      const fileName = `file_${i}${fileExtension}`;

      formData.append('files', blob, fileName);
    }
    formData.append('loanId', loanId);
    formData.append('userId', userId);
    this._loanService.uploadFiles(formData).subscribe({
      next: (response) => {
        console.log(response)
        if(response && response.files!=null && response.files.length>0){
          this.util.showSimpleAlert("Loan created successfully");
        }
        else{
          this.util.showSimpleAlert("Loan created successfully, but documents were not uploaded due to a technical issue. You can upload them later.");
        }
        this.resetForm();
        this.isSubmitted = false;
        this.files = [];
        setTimeout(() => {
          this.navCtrl.navigateRoot(['/loan-detail-by-id'], { queryParams: { loanId: loanId } });
        }, 500);
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.util.showErrorAlert("Failed to upload files.");
        this.resetForm();
        this.isSubmitted = false;
      }
    });
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  goToBack() {
    this.navCtrl.back();
  }

}
