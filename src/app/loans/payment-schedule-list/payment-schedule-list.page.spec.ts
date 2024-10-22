import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentScheduleListPage } from './payment-schedule-list.page';

describe('PaymentScheduleListPage', () => {
  let component: PaymentScheduleListPage;
  let fixture: ComponentFixture<PaymentScheduleListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaymentScheduleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
