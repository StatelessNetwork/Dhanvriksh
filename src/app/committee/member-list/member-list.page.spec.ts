import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberListPage } from './member-list.page';

describe('MemberListPage', () => {
  let component: MemberListPage;
  let fixture: ComponentFixture<MemberListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MemberListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
