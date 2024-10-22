import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoanService } from 'src/app/services/loan.service';

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.page.html',
  styleUrls: ['./documents-upload.page.scss'],
})
export class DocumentsUploadPage implements OnInit {
 
  files: (File | any)[] = [];  // Stores the file paths or URIs
  uploadedFileUrls: string[] = []; // URLs of uploaded files

  constructor(private uploadService: LoanService) {}

  ngOnInit() {
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
    });

    this.files.push(image.webPath!);
  }

  selectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const selectedFiles = Array.from(event.target.files) as File[];
      this.files.push(...selectedFiles);
    }
  }

  

  private async fetchFileAsBlob(fileOrUrl: File | string): Promise<Blob> {
    if (typeof fileOrUrl === 'string') {
      const response = await fetch(fileOrUrl);
      return response.blob();
    } else {
      return fileOrUrl;
    }
  }

  private getFileExtension(fileOrUrl: File | string): string {
    if (typeof fileOrUrl === 'string') {
      const mimeType = fileOrUrl.split(';')[0].split(':')[1];
      return this.mapMimeTypeToExtension(mimeType);
    } else if (fileOrUrl instanceof File) {
      const fileName = fileOrUrl.name;
      const extension = fileName.split('.').pop();
      return extension ? `.${extension}` : '';
    }
    return '';
  }

  private mapMimeTypeToExtension(mimeType: string): string {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'application/pdf':
        return '.pdf';
      default:
        return '';
    }
  }

  async uploadFiles() {
    if (this.files.length === 0) {
      alert('Please select or capture files first.');
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      const fileOrUrl = this.files[i];
      const blob = await this.fetchFileAsBlob(fileOrUrl);
      const fileExtension = this.getFileExtension(fileOrUrl);
      const fileName = `file_${i}${fileExtension}`;

      formData.append('files', blob, fileName);
    }

    this.uploadService.uploadFiles(formData).subscribe({
      next: (response) => {
        alert('Files uploaded successfully!');
        this.uploadedFileUrls = response.files; // Assuming API response contains file URLs
        this.files = [];
      },
      error: (error) => {
        console.error('Upload error:', error);
        alert('Failed to upload files.');
      }
    });
  }
}