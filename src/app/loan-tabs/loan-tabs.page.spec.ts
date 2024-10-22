import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanTabsPage } from './loan-tabs.page';

describe('LoanTabsPage', () => {
  let component: LoanTabsPage;
  let fixture: ComponentFixture<LoanTabsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoanTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
