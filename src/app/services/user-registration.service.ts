import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { userRegistrationModel } from '../model/userRegistration-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  private URL=environment.url+"/api/UserRegistration";
  constructor(private http:HttpClient) { }

  saveUpdateUserRegistrationData(objdata:userRegistrationModel):Observable<any>{
    return this.http.post(this.URL+"/SaveUpdateUserRegistrationDetails",objdata)
  }

  deleteAccount(objdata:userRegistrationModel):Observable<any>{
    return this.http.post(this.URL+"/deleteAccountDetails",objdata)
  }
}
