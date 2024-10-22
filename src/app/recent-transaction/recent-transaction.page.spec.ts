import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentTransactionPage } from './recent-transaction.page';

describe('RecentTransactionPage', () => {
  let component: RecentTransactionPage;
  let fixture: ComponentFixture<RecentTransactionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecentTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
