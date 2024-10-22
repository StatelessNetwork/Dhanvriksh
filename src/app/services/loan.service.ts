import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoanModel } from '../model/LoanModel';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private URL=environment.url+"/api/Loan";
  constructor(private http:HttpClient) {}

  saveLoanDetails(objdata:LoanModel):Observable<any>{
    return this.http.post(this.URL+"/saveLoanDetails",objdata)
  }

  uploadFiles(formData: FormData): Observable<any> {
    return this.http.post(this.URL+'/uploadImages', formData);
  }

  getLoanDetailsById(loanId: string,userId:string): Observable<any> {
    return this.http.get(this.URL+'/GetLoanDetailsById?loanId='+loanId+'&userId='+userId);
  }

  getLoanList(userId:string): Observable<any> {
    return this.http.get(this.URL+'/GetLoanList?userId='+userId);
  }

  saveLoanPayment(paymentData: any): Observable<any> {
    return this.http.post(this.URL + '/save-loan-payment', paymentData);
  }

  getScheduledPaymentsByScheduleID(ScheduleId:string,userId:string): Observable<any> {
    return this.http.get(this.URL+'/getScheduledPaymentsByScheduleID?ScheduleId='+ScheduleId+'&userId='+userId);
  }

  GetLoanPaymentScheduleByLoanId(loanId: string): Observable<any> {
    return this.http.get(this.URL+'/GetLoanPaymentScheduleByLoanId?loanId='+loanId);
  }

  GetPaymentHistoryByScheduleID(ScheduleId: string): Observable<any> {
    return this.http.get(this.URL+'/GetPaymentHistoryByScheduleID?ScheduleId='+ScheduleId);
  }

  GetCountPendingInstallment(LoanID: string, userId: string): Promise<any> {
    return firstValueFrom(this.http.get(this.URL + '/GetCountPendingInstallment?LoanID=' + LoanID + '&UserId=' + userId));
  }

  closeLoan(loanId: string, userId: string): Observable<any> {
    const body = { LoanID: loanId, UserId: userId };
    return this.http.post(`${this.URL}/CloseLoan`, body);
  }

  GetLoanNotification(UserId: string): Observable<any> {
    return this.http.get(this.URL+'/GetLoanNotification?UserId='+UserId);
  }
}
