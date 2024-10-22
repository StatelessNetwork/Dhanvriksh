import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitteeListPage } from './committee-list.page';

describe('CommitteeListPage', () => {
  let component: CommitteeListPage;
  let fixture: ComponentFixture<CommitteeListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommitteeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
