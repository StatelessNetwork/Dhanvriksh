import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddExistingMemberPage } from './add-existing-member.page';

describe('AddExistingMemberPage', () => {
  let component: AddExistingMemberPage;
  let fixture: ComponentFixture<AddExistingMemberPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddExistingMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
