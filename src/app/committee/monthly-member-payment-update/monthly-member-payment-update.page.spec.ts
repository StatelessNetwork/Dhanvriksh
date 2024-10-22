import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthlyMemberPaymentUpdatePage } from './monthly-member-payment-update.page';

describe('MonthlyMemberPaymentUpdatePage', () => {
  let component: MonthlyMemberPaymentUpdatePage;
  let fixture: ComponentFixture<MonthlyMemberPaymentUpdatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MonthlyMemberPaymentUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
