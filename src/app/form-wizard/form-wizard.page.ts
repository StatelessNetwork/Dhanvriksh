import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-wizard',
  templateUrl: './form-wizard.page.html',
  styleUrls: ['./form-wizard.page.scss'],
})
export class FormWizardPage implements OnInit {

  wizardForm: FormGroup;
  currentStep: number = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.wizardForm = this.fb.group({
      step1: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      step2: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
      }),
      step3: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });
  }

  getStepFormGroup(step: number): FormGroup {
    return this.wizardForm.get(`step${step}`) as FormGroup;
  }

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitForm() {
    if (this.wizardForm.valid) {
      console.log(this.wizardForm.value);
      // Submit the form data
    } else {
      console.log('Form is not valid');
    }
  }

  isCurrentStepValid(): boolean {
    return this.getStepFormGroup(this.currentStep + 1).valid;
  }

}
