import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitteeDetailsPage } from './committee-details.page';

describe('CommitteeDetailsPage', () => {
  let component: CommitteeDetailsPage;
  let fixture: ComponentFixture<CommitteeDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommitteeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
