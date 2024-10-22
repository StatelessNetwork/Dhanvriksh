import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { committeeModel, committeeMonthlyBreakupModel, memberMappedWithCommitteeModel, memberModel, monthlyMemberBreakupModel } from '../model/committee-model';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {
  private URL=environment.url+"/api/Committee";
  constructor(private http:HttpClient) {
    
   }

   getCommitteeList(userId:string):Observable<any>{
   // const headers = new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVOdW1iZXIiOiI4Mjg1ODI5NjY2IiwianRpIjoiMDkxZDExZGMtNjA1Mi00MDE5LWI2NDgtOTI5ODlmOGVkMWQxIiwiUm9sZSI6IiIsImV4cCI6MTY5NTE0ODY3MiwiaXNzIjoiSldNZWV0aXZhSXNzdWVyIiwiYXVkIjoiSldUTWVldGl2YUF1ZGllbmNlIn0.yCJEe-YEJPcNmvAXIWAkECA3zqxMaw9xnlKIbANGVj8'})
    return this.http.get(this.URL+"/getCommitteeDataList?userId="+userId)
  }

  saveUpdateCommitteeDetails(objdata:committeeModel):Observable<any>{
    return this.http.post(this.URL+"/SaveUpdateCommitteeDetails",objdata)
  }

  getCommitteeByIdDetails(committeeId:string, userId:string):Observable<any>{
    return this.http.get(this.URL+"/getCommitteeByIdDetails?committeeId="+committeeId+"&userId="+userId);
  }

  saveUpdateCommitteeMember(objdata:memberModel):Observable<any>{
    return this.http.post(this.URL+"/SaveUpdateMemberDetails",objdata)
  }

  getMemberList(userId:string):Observable<any>{
    return this.http.get(this.URL+"/getMemberDataList?userId="+userId)
  }

  getMemberById(memberId:string):Observable<any>{
    return this.http.get(this.URL+"/getMemberById?memberId="+memberId)
  }

  getMemberListMappingWithCommitteeList(committeeId:string, userId:string):Observable<any>{
    return this.http.get(this.URL+"/getMemberListMappingWithCommittee?committeeId="+committeeId+"&userId="+userId);
  }

  getNotMappedMemberWithCommitteeList(committeeId:string, userId:string):Observable<any>{
    return this.http.get(this.URL+"/getNotMappedMemberWithCommitteeList?committeeId="+committeeId+"&userId="+userId);
  }

  saveUpdateMappingWithMember(objdata:memberMappedWithCommitteeModel):Observable<any>{
    return this.http.post(this.URL+"/saveUpdateMappingWithMember",objdata)
  }
  
  getCommitteeMonthlyBreakupList(committeeId:string, userId:string):Observable<any>{
    return this.http.get(this.URL+"/getCommitteeMonthlyBreakupList?committeeId="+committeeId+"&userId="+userId);
  }

  getMonthlyBreakupByIdData(monthlyCommitBreakupId:string, userId:string):Observable<any>{
    return this.http.get(this.URL+"/getMonthlyBreakupByIdData?monthlyCommitBreakupId="+monthlyCommitBreakupId+"&userId="+userId);
  }

  updateCommitteeMonthlyBreakupDetails(objdata:committeeMonthlyBreakupModel):Observable<any>{
    return this.http.post(this.URL+"/updateCommitteeMonthlyBreakupDetails",objdata)
  }

  getMemberBreakupListByIdData(monthlyCommitBreakupId:string, userId:string):Observable<any>{
    return this.http.get(this.URL+"/getMemberBreakupListByIdData?monthlyCommitBreakupId="+monthlyCommitBreakupId+"&userId="+userId);
  }

  updateMemberMonthlyBreakupDetails(objdata:monthlyMemberBreakupModel):Observable<any>{
    return this.http.post(this.URL+"/UpdateMemberMonthlyBreakupDetails",objdata)
  }

  GetCommitteeNotification(UserId: string): Observable<any> {
    return this.http.get(this.URL+'/GetLoanNotification?UserId='+UserId);
  }

}
