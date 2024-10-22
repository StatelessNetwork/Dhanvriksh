import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private URL=environment.url+"/api/Member";
  constructor(private http:HttpClient) {

   }

   searchMembers(SearchText:string,UserId:string):Observable<any>{
    return this.http.get(this.URL+"/getSearchMember?UserId="+UserId+"&SearchText="+SearchText);
  }

}
