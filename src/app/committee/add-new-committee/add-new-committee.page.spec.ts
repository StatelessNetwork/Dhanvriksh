import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewCommitteePage } from './add-new-committee.page';

describe('AddNewCommitteePage', () => {
  let component: AddNewCommitteePage;
  let fixture: ComponentFixture<AddNewCommitteePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddNewCommitteePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
