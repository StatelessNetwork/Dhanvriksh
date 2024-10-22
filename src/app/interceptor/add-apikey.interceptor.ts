import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AddAPIKeyInterceptor implements HttpInterceptor {

  constructor() {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authReq = req.clone({
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-API-Key': environment.apiKey
      })
    });
    
    return next.handle(authReq);
  }
}
