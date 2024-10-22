import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanDetailByIdPage } from './loan-detail-by-id.page';

describe('LoanDetailByIdPage', () => {
  let component: LoanDetailByIdPage;
  let fixture: ComponentFixture<LoanDetailByIdPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoanDetailByIdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
