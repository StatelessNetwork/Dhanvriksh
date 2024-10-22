import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthlyMemberBreakupPage } from './monthly-member-breakup.page';

describe('MonthlyMemberBreakupPage', () => {
  let component: MonthlyMemberBreakupPage;
  let fixture: ComponentFixture<MonthlyMemberBreakupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MonthlyMemberBreakupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
