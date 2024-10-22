import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNewLoanPage } from './create-new-loan.page';

describe('CreateNewLoanPage', () => {
  let component: CreateNewLoanPage;
  let fixture: ComponentFixture<CreateNewLoanPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateNewLoanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
