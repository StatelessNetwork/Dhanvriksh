import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentNotificationPage } from './recent-notification.page';

describe('RecentNotificationPage', () => {
  let component: RecentNotificationPage;
  let fixture: ComponentFixture<RecentNotificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecentNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
