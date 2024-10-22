import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL=environment.url+"/api/login";
  constructor(private http:HttpClient) { }

  validateMobileNumber(mobileNumber:string):Observable<any>{
    return this.http.get(this.URL+"/validateUserMobileNumberDetails?mobileNumber="+mobileNumber);
  }
  
  getLoginDetails(mobileNumber:string):Observable<any>{
    return this.http.get(this.URL+"/getLoginDetails?mobileNumber="+mobileNumber);
  }
}
