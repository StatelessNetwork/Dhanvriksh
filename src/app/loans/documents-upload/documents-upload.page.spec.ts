import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsUploadPage } from './documents-upload.page';

describe('DocumentsUploadPage', () => {
  let component: DocumentsUploadPage;
  let fixture: ComponentFixture<DocumentsUploadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DocumentsUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
