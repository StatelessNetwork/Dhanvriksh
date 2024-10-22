export class committeeModel {
    committeeId :number ;
    holderName:string;
    totalCommitteeAmount:any;
    totalMember:number;
    pricePerMemberCommittee:any;
    totalMonthsOfCommittee :number;
    startDate:any;
    endDate :any;
    bufferDays:number;
    isBufferDaysForPayments :boolean;
    penaltyAmount :any;
    status :number;
    numberOfOwnCommittee :number;
    frequencyType :number;
    ip :string;
    createdBy :string;
    action :string;
}


export class memberModel {
    memberId :number ;
    committeeId :string ;
    firstName:string;
    lastName:string;
    mobileNumber:string;
    emailId:string;
    address :string;
    countryId:string;
    stateId :any;
    cityId:string;
    pincode :boolean;
    status :number;
    ip :string;
    createdBy :string;
    action :string;
}

export class memberMappedWithCommitteeModel {
    memberId :string ;
    committeeId :string ;
    ip :string;
    createdBy :string;
    action :string;
}

export class mappingOutPutModel{
    committeeId:string;
    memberId:string;
    result:any;
    firstName:string;
    lastName:string;
    emailId:string;
    mobileNumber:string;
}

export class committeeMonthlyBreakupModel{
    monthlyCommitBreakupId:string;
    committeeId:string;
    monthlyCommitteeOwnerId:string;
    lossAmount:number;
    remarks:string;
    userId:string;
    action:string;
}

export class monthlyMemberBreakupModel{
    memberMonthlyBreakupId:string
    monthlyCommitBreakupId:string;
    paymentStatus:string;
    penaltyAmount:number;
    remarks:string;
    userId:string;
    action:string;
}