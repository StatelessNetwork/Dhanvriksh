import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegsiterByMobileNumberPage } from './regsiter-by-mobile-number.page';

describe('RegsiterByMobileNumberPage', () => {
  let component: RegsiterByMobileNumberPage;
  let fixture: ComponentFixture<RegsiterByMobileNumberPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegsiterByMobileNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
