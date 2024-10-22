export class LoanModel {
    LoanID: number;
    MemberID: string;
    LoanAmount: number;
    InterestType: string;
    InterestRate: number;
    FixedInterestAmount: number;
    Tenure: number;
    TenureType:string;
    PaymentFrequency: number;
    StartDate: Date;
    LoanStatus: string;
    IP: string;
    UserId:string;
    EMIType:string;
    InterestPeriod:string;
    constructor(init?: Partial<LoanModel>) {
        Object.assign(this, init);
    }

  }
  