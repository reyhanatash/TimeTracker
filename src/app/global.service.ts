import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  mySubject : Subject<any> = new Subject<any>();
  mySubject2 : Subject<any> = new Subject<any>();
  staffCo;
  bs64;
  timeSheetDate;
  staffSetter(data:any){
    this.staffCo = data;
    this.mySubject.next(this.staffCo);
  }
  bs64Setter(data:any){
    this.bs64 = data;
    this.mySubject2.next(this.staffCo);
  }
  constructor() {
  }
}
