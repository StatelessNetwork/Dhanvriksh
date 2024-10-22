import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitteeMappingMemberPage } from './committee-mapping-member.page';

describe('CommitteeMappingMemberPage', () => {
  let component: CommitteeMappingMemberPage;
  let fixture: ComponentFixture<CommitteeMappingMemberPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommitteeMappingMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
