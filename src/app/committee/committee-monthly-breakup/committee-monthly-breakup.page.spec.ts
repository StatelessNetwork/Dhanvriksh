import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitteeMonthlyBreakupPage } from './committee-monthly-breakup.page';

describe('CommitteeMonthlyBreakupPage', () => {
  let component: CommitteeMonthlyBreakupPage;
  let fixture: ComponentFixture<CommitteeMonthlyBreakupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommitteeMonthlyBreakupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
