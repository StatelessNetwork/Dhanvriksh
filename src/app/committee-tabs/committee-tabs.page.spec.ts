import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitteeTabsPage } from './committee-tabs.page';

describe('CommitteeTabsPage', () => {
  let component: CommitteeTabsPage;
  let fixture: ComponentFixture<CommitteeTabsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommitteeTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
