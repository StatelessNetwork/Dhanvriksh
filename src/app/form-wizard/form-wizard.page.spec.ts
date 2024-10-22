import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormWizardPage } from './form-wizard.page';

describe('FormWizardPage', () => {
  let component: FormWizardPage;
  let fixture: ComponentFixture<FormWizardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormWizardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
