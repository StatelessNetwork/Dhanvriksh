import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserDetailsPage } from './add-user-details.page';

describe('AddUserDetailsPage', () => {
  let component: AddUserDetailsPage;
  let fixture: ComponentFixture<AddUserDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUserDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
