import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthlyCommitteeDrawnUpdatePage } from './monthly-committee-drawn-update.page';

describe('MonthlyCommitteeDrawnUpdatePage', () => {
  let component: MonthlyCommitteeDrawnUpdatePage;
  let fixture: ComponentFixture<MonthlyCommitteeDrawnUpdatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MonthlyCommitteeDrawnUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
