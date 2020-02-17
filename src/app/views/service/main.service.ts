import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import * as sha256 from 'sha256/lib/sha256.js';
import 'rxjs/add/operator/map';


@Injectable()
export class MainService {
  edit;
  mdata: {};

  constructor(private http: HttpClient, private router: Router) {
  }

  data: {};
  // url = 'http://192.168.1.33:3200/';
  // url = 'http://192.168.1.46:3200/';
  url = 'http://164.132.119.216:3200/';

  login(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.url + 'api/user/login', data, httpOptions);

  }

  loadJobs() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + 'api/main/loadJobs', httpOptions);
  }

  saveJob(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post(this.url + 'api/main/addJob', data, httpOptions);
  }

  deleteJob(jobCo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      jobCo: jobCo
    }
    return this.http.post(this.url + 'api/main/deleteJob', data, httpOptions);
  }

  loadJobType() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + 'api/main/loadJobType', httpOptions);
  }
    
  saveJobsType(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post(this.url + 'api/main/addJobType', data, httpOptions);
  }

  deleteJobType(jobTypeCo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      jobTypeCo: jobTypeCo
    }
    return this.http.post(this.url + 'api/main/deleteJobType', data, httpOptions);
  } 
  
  loadActivity() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + 'api/main/loadActivity', httpOptions);
  }

  addActivity(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post(this.url + 'api/main/addActivity', data, httpOptions);
  }
    
  deleteActivity(activityCo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      activityCo: activityCo
    }
    return this.http.post(this.url + 'api/main/deleteActivity', data, httpOptions);
  }  
 
  loadStaff() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + 'api/main/loadStaff', httpOptions);
  } 

  addStaff(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post(this.url + 'api/main/addStaff', data, httpOptions);
  }

  deleteStaff(staffCo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      staffCo: staffCo
    }
    return this.http.post(this.url + 'api/main/deleteStaff', data, httpOptions);
  }

  addTimeSheet(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post(this.url + 'api/main/addTimeSheet', data, httpOptions);
  }

  loadTimeSheetStaff(monthCo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      monthCo: monthCo
    }
    return this.http.post(this.url + 'api/main/loadTimeSheetStaffs', data, httpOptions);
  }
  
  loadDaysOfStaff(monthCo,staffCo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      monthCo: monthCo,
      staffCo: staffCo
    }
    return this.http.post(this.url + 'api/main/loadDaysOfStaff', data, httpOptions);
  }

  loadMonthId(date) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      date: date,
    }
    return this.http.post(this.url + 'api/main/loadMonthId', data, httpOptions);
  }
 
  addAccount(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post(this.url + 'api/main/saveAccount', data, httpOptions);
  }  

  addSetting(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post(this.url + 'api/main/saveSetting', data, httpOptions);
  }
    
  loadHoursOfDay(staffCo, date) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      staffCo: staffCo,
      date: date
    }
    return this.http.post(this.url + 'api/main/loadHoursOfDay', data, httpOptions);
  }

  loadAccSetting() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + 'api/main/loadAccSetting', httpOptions);
  } 

  deleteTime(timeSheetCo) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      timeSheetCo: timeSheetCo
    }
    return this.http.post(this.url + 'api/main/deleteTime', data, httpOptions);
  }

      
  addLaunchTime(staffCo, date) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      staffCo: staffCo,
      date: date
    }
    return this.http.post(this.url + 'api/main/addLaunchTime', data, httpOptions);
  }

    
  loadApprove(staffCo, monthCo, isApproved) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      staffCo: staffCo,
      monthCo: monthCo,
      isApproved: isApproved,
    }
    return this.http.post(this.url + 'api/main/approveStaff', data, httpOptions);
  }
    
  approveCompany(monthCo, isApproved) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      monthCo: monthCo,
      isApproved: isApproved,
    }
    return this.http.post(this.url + 'api/main/approveCompany', data, httpOptions);
  }
    
  sendApproveMail(file, fileName) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      file: file,
      fileName: fileName,
    }
    return this.http.post(this.url + 'api/main/sendApproveMail', data, httpOptions);
  }
    
  changePassword(email) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    let data = {
      email: email,
    }
    return this.http.post(this.url + 'api/user/changePassword', data, httpOptions);
  }
  
  getServerDate() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + 'api/main/getServerDate', httpOptions);
  } 
}
