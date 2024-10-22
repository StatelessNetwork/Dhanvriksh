import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { applicationObject } from '../model/applicationEnum';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private _storageService:StorageService) {}
    intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header to request

      // Check if the request is for file upload
      const isFileUpload = request.url.includes('/uploadImages');
    
      return from(this._storageService.get(applicationObject.token).then((data) => {
        let headers = {
          Authorization: data?.token ? `Bearer ${data.token}` : ''
        };
  
        // Conditionally set the Content-Type header
        if (!isFileUpload) {
          headers['Content-Type'] = 'application/json';
        }
  
        return request.clone({ setHeaders: headers });
      })).pipe(switchMap(newReq => newRequest.handle(newReq)));
  //   return from(this._storageService.get(applicationObject.token).then((data) => {
  //     if(data!=null && data.token!=null){
  //     return request.clone({
  //         setHeaders: {
  //             "Content-Type": "application/json",
  //             Authorization: "Bearer " + data.token
  //         }
  //     });
  //   }
  //   else{
  //       return request.clone({
  //         setHeaders: {
  //           "Content-Type": "application/json"
  //       }
  //     });
  //   }
  // })).pipe(switchMap(newReq => newRequest.handle(newReq)));

}
}
