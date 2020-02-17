export class Job {
    jobCo: number;
    jobNumber: string;
    jobTypeCo: number;
    clientName: string;
    address: string;
    startDate: any;
}

export class Staff {
    staffCo: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export class Activity {
    activityDesc: string;
    activityCo: number;
}

export class JobsType {
    jobTypeCo: number;
    typeDesc: string;
}

export class TimeSheet{
    timeSheetCo: number;
    jobCo: number;
    staffCo: number;
    activityCo: number;
    note: string;
    date: any;
    startTime: any;
    endTime: any;
}

export class Account{
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    password: string;
    companyName: string;
}

export class Setting{
    accountantName: string;
    accountantEmail: string;
    startingDate: string;
}