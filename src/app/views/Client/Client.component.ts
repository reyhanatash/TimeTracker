import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  Injectable
} from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subWeeks,
  startOfMonth,
  addWeeks
} from "date-fns";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarUtils,
  CalendarMonthViewDay
} from "angular-calendar";
import { GetMonthViewArgs, MonthView, getWeekView, WeekView, GetWeekViewArgs } from 'calendar-utils';
import { MainService } from "../service/main.service";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../../global.service";
import { TimeSheet } from "../models/Main";
import * as moment from "moment";
import * as alertify from "../../../assets/alertify.js";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

@Injectable()
export class MyCalendarUtils extends CalendarUtils {
  getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = subWeeks(startOfMonth(args.viewDate), 1);
    args.viewEnd = addWeeks(endOfMonth(args.viewDate), 1);
    return super.getMonthView(args);
  }
}

@Component({
  selector: "app-client",
  templateUrl: "./Client.component.html",
  styleUrls: ["./Client.component.css"],
  providers: [
    {
      provide: CalendarUtils,
      useClass: MyCalendarUtils
    }
  ]
})
export class ClientComponent {

  //TODO: 
  // getWeekView(args: GetWeekViewArgs): WeekView {
  //   args.viewStart = startOfMonth(args.viewDate);
  //   args.viewEnd = endOfMonth(args.viewDate);
  //   return getWeekView(args);
  // }

  displayedColumns: string[] = [
    "date",
    "startDate",
    "endDate",
    "duration",
    "jobNumber",
    "activity",
    "note"
  ];
  dataSource: MatTableDataSource<TimeSheet>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  timeSheet;
  jobs;
  monthNo;
  months;
  yearNo;
  monthStartDate;
  monthEndDate;
  totalTime;
  src;
  staffCo;
  activities;
  editMode;
  selectedJobValue = "Job #";
  selectedActivityValue = "Activity";
  selectedStaffValue = "Staff";
  monthStartTime;
  monthEndTime;
  dayEndDate;
  yearEndDate;
  payPeriod;
  DateEndHours;
  DateEndMinutes;
  DateStartHours;
  DateStartMinutes;
  total;
  timeStaffs;
  monthInfo;
  staffTotalTime;
  startHours;
  startMinutes;
  endHours;
  endMinutes;
  durationTime;
  isToday;
  dateServer;
  totalPerTime;
  sumHours;
  staffName= localStorage.getItem('staffFName');
  staffFamily= localStorage.getItem('staffLName');
  monthsName = new Map([
    ["1", "JAN"],
    ["2", "FEB"],
    ["3", "MAR"],
    ["4", "APR"],
    ["5", "MAY"],
    ["6", "JUN"],
    ["7", "JUL"],
    ["8", "AUG"],
    ["9", "DEC"],
    ["10", "OCT"],
    ["11", "NOV"],
    ["12", "DEC"]
  ]);
  tempPre;
  tempNext;
  endDate;
  startDate;
  subMinutes;
  subHours;
  @ViewChild("modalContent") modalContent: TemplateRef<any>;
  getTodayDate = new Date();
  todayDate = moment(this.getTodayDate).format("YYYY/MM/DD");
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  clickedDate: Date;

  clickedColumn: number;

  activeDayIsOpen: boolean = true;

  constructor(
    private service: MainService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public global: GlobalService,
    private modal: NgbModal
  ) {
    setTimeout(() => {
      $('.cal-header').on('click',function(){
        $('.cal-header').removeClass('backgroundSelected')
        $(this).addClass('backgroundSelected');
        $(this).hasClass('backgroundSelected');
      })
    },0);
    this.timeSheet = new TimeSheet();
  }
  ngOnInit() {
    let myThis = this
    this.loadJobs();
    this.loadActivity();
    this.loadHoursOfDay();
    this.loadMonthId();

    const staffId = localStorage.getItem('staffId')
    this.service.getServerDate().subscribe(data => {
      this.dateServer = data['data']
    })
    this.service.loadMonthId(this.changeDate(this.dateServer)).subscribe(data => {
      this.src = data["data"];
      this.monthInfo = this.src.map(data => {
        return {
          monthCo: data.FldPkMonthCo,
        };
      });
      let monthCo = this.monthInfo[0].monthCo;
      this.service.loadTimeSheetStaff(monthCo).subscribe(data => {
        this.src = data["data"];
        this.staffTotalTime = this.duration(data["data"].find(x => x.FldPkStaffCo == +staffId)[
          "Duration"
        ]);
      });
    });
   
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: "lg" });
  }

  loadGrid(): void {
    if (this.clickedDate) {
      const date = this.clickedDate.toString();
      const today = new Date();
      if (date != today.toString()) {
        this.clickedLoadHoursOfDay();
      } else {
        this.loadHoursOfDay();
      }
    }
  }

  addEvent(): void {
    this.editMode = false
    this.loadGrid();
    // this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: "lg" });
    this.clear()
    this.events = [
      // ...this.events,
    ];
  }

  loadMonthId() {
    this.service.getServerDate().subscribe(data => {
      this.dateServer = data['data']
    })
    this.service.loadMonthId(this.changeDate(this.dateServer)).subscribe(data => {
      this.months = data["data"];
      this.months.map(data => {
        let showDate = new Date(data.FldEndDate);
        this.monthNo = data.FldPkMonthCo;
        this.monthStartTime = this.getTime(data.FldStartDate);
        this.monthEndTime = this.getTime(data.FldEndDate);
        this.dayEndDate = showDate.getDate();
        this.monthEndDate = this.getNameMonth(showDate.getMonth() + 1);
        this.yearEndDate = showDate.getFullYear();
        this.payPeriod = data.PayPeriod;
        // (this.totalTime = this.monthEndDate - this.monthStartDate);
      });
    });
  }

  loadHoursOfDay() {
    $('.preBtn').attr('disabled' , 'disabled')
    const today = new Date()
    this.isToday = true
    const staffId = localStorage.getItem("staffId");
    this.service.loadHoursOfDay(staffId, this.getCorrectDate(today))
      .subscribe(data => {
        this.src = data["data"];
        this.timeStaffs = this.src.map(data => {
          let totalPerTimes = 0
          for (let i = 0; i < this.src.length; i++) {
            totalPerTimes += parseInt(this.src[i]['Duration']);
            this.totalPerTime = totalPerTimes
          }
          return {
            timeSheetCo: data.FldPkTimeSheetCo,
            activity: data.FldActivityDesc,
            date: this.getCorrectDate(data.FldDate),
            endDate: this.changeTime(data.FldOut),
            jobNumber: data.FldJobNumber,
            startDate: this.changeTime(data.FldIn),
            staffCo: data.FldPkStaffCo,
            duration: data.Duration,
            // durationPerTime: this.xxxx(data.Duration),
            note: data.FldNote,
            FldPkJobCo: data.FldPkJobCo,
            FldPkActivityCo: data.FldPkActivityCo,
            FldPkTimeSheetCo:data.FldPkTimeSheetCo,   
            myDuration : this.calculateDuration(this.changeTime(data.FldOut),this.changeTime(data.FldIn))
         
          };        
        });
      });
  }

  clickedLoadHoursOfDay() {
    const today = new Date()
    const todayDate = this.convertDate(today.toLocaleString());
    const date = this.convertDate(this.clickedDate.toLocaleString());
    if((date as any) === (todayDate as any)) {
      this.isToday = true
    }
    else {
      this.isToday = false
    }
    const staffId = localStorage.getItem("staffId");
    this.service.loadHoursOfDay(staffId, date).subscribe(data => {
      this.src = data["data"];
      this.timeStaffs = this.src.map(data => {
        let totalPerTimes = 0
        for (let i = 0; i < this.src.length; i++) {
          totalPerTimes += parseInt(this.src[i]['Duration']);
          this.totalPerTime = totalPerTimes
        }
        return {
          timeSheetCo: data.FldPkTimeSheetCo,
            activity: data.FldActivityDesc,
            date: this.getCorrectDate(data.FldDate),
            endDate: this.changeTime(data.FldOut),
            jobNumber: data.FldJobNumber,
            startDate: this.changeTime(data.FldIn),
            staffCo: data.FldPkStaffCo,
            duration: data.Duration,
            // durationPerTime: this.xxxx(data.Duration),
            note: data.FldNote,
            FldPkJobCo: data.FldPkJobCo,
            FldPkActivityCo: data.FldPkActivityCo,
            FldPkTimeSheetCo:data.FldPkTimeSheetCo,
            myDuration : this.calculateDuration(this.changeTime(data.FldOut),this.changeTime(data.FldIn))
        };
      });

    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getNameMonth(monthNo) {
    for (let i = 0; i <= 12; i++) {
      if (monthNo == i) {
        return this.monthsName.get(`${i}`);
      }
    }
  }

  loadJobs() {
    this.service.loadJobs().subscribe(data => {
      this.jobs = data["data"];
    });
  }

  loadActivity() {
    this.service.loadActivity().subscribe(data => {
      this.activities = data["data"];
    });
  }
  
  editTime(item) {
    // let d = row.startDate.split('/');
    // this.editedId = row.jobCo
    this.editMode = true;
    this.modal.open(this.modalContent, { size: "lg" });
    this.timeSheet.jobCo = +item.FldPkJobCo;
    this.timeSheet.activityCo = item.FldPkActivityCo;
    this.timeSheet.startTime = new Date("2000/01/01 " + item.startDate);
    this.timeSheet.endTime = new Date("2000/01/01 " + item.endDate);
    this.timeSheet.note = item.note;
    this.timeSheet.timeSheetCo = item.FldPkTimeSheetCo
  }

  saveTimeSheet() {
    if(this.timeSheet.jobCo === null || this.timeSheet.jobCo === undefined) {
      alertify.error("Job number field is required")
      return false
    }
    if(this.timeSheet.activityCo === null || this.timeSheet.activityCo === undefined) {
      alertify.error("Activity field is required")
      return false
    }
    if(this.timeSheet.startTime === null || this.timeSheet.startTime === undefined || this.timeSheet.startTime === "") {
      alertify.error("Start time is required")
      return false
    }
    if(this.timeSheet.endTime === null || this.timeSheet.endTime === undefined || this.timeSheet.endTime === "") {
      alertify.error("End time is required")
      return false
    }
    if(this.timeSheet.startTime >= this.timeSheet.endTime) {
      alertify.error("Start time should not be equal to or greater than end time")
      return false
    }
    let data = {
      timeSheetCo: this.timeSheet.timeSheetCo || -1,
      jobCo: this.timeSheet.jobCo,
      staffCo: localStorage.getItem("staffId"),
      activityCo: this.timeSheet.activityCo,
      note: this.timeSheet.note,
      date: moment(this.timeSheet.date).format("YYYY/MM/DD"),
      startTime: this.isoDate(+this.timeSheet.startTime),
      endTime: this.isoDate(+this.timeSheet.endTime)
    };
    this.endHours = this.getHours(this.timeSheet.endTime)
    this.startHours = this.getHours(this.timeSheet.startTime)
    if((+this.endHours) < (+this.startHours)) {
      this.endHours = (+this.endHours) + 12
      this.startHours = (+this.startHours) - 12
    }
    this.durationTime = (+this.endHours) - (+this.startHours)
    this.service.addTimeSheet(data).subscribe(data => {
        try {
          if (data['data'][0]['FldPkTimeSheetCo']) {
            alertify.success("success");
            if(this.durationTime >= 8){
              (alertify as any).confirm("Do you want add lunch time?", () => {
                let today = new Date();
                const staffCo = localStorage.getItem("staffId");
                this.service.addLaunchTime(staffCo, this.getCorrectDate(today)).subscribe(
                    data => {
                      if (data["msg"] === "success") {
                        alertify.success("Lunch time is added");
                        ($("#timeModal") as any).modal("hide");
                        this.loadHoursOfDay();
                      } else {
                        alertify.error("an error has occurred");
                      }
                    },
                    error => {
                      let e = error;
                      alertify.error("error");
                    }
                  );
              });
            }
          }
          if (data['data'][0]['Descr']){
            alertify.error(data['data'][0]['Descr'])
          }
          this.clear();
          this.modal.dismissAll("Reason");
          this.loadHoursOfDay();
          this.clickedLoadHoursOfDay();
          // this.modal.dismissAll("Reason");
        } catch {
          // alertify.error(data['data'][0].Descr);
        }
      },
      error => {}
    );
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDayPre() {
    $('.preBtn').attr('disabled' , 'disabled')
    setTimeout(() => {
      
      let c = 0;
      //get all showing days
      var elements = $(".cal-day-headers");
      let days:any = elements.children();
      for(let day of days){ 
        let date = day.innerHTML.match(/\<span\>(.*)\<\/span\>/).pop();
        let currentMonth = (new Date()).getMonth();
        let showedMonth = (new Date("1991 "+date)).getMonth();
        setTimeout(() => {
          if(currentMonth == showedMonth){  
            this.loadGrid();
          }
        }, 0);        

        if(currentMonth != showedMonth)
        {
          $(day).css('background-color','#eee');
          $(day).off('click');

          $('.preBtn').attr('disabled' , 'disabled')
          $(".NextBtn").removeAttr('disabled');
          c++;
        }

      }
      if(c === 0){
        $(".preBtn").removeAttr('disabled');
        $('.NextBtn').removeAttr('disabled');
      }
    }, 0);
    
    this.activeDayIsOpen = false;
  }

  closeOpenMonthViewDayNext() {
    $('.NextBtn').attr('disabled' , 'disabled')
    setTimeout(() => {
      let c = 0;
      //get all showing days
      var elements = $(".cal-day-headers");
      let days:any = elements.children();
      for(let day of days){
        let date = day.innerHTML.match(/\<span\>(.*)\<\/span\>/).pop();
        let currentMonth = (new Date()).getMonth();
        let showedMonth = (new Date("1991 "+date)).getMonth();
        setTimeout(() => {
          if(currentMonth == showedMonth){  
            this.loadGrid();
          }
        }, 0);

        setTimeout(() => {
          
        }, 0);
        if(currentMonth != showedMonth)
        {
          $(day).css('background-color','#eee');
          $(day).off('click');
          $(".preBtn").removeAttr('disabled');
          $('.NextBtn').attr('disabled' , 'disabled')

          c++;
        }
      }
      if(c === 0){
        $(".preBtn").removeAttr('disabled');
        $(".NextBtn").removeAttr('disabled');

      }
    }, 0);
    
    this.activeDayIsOpen = false;
  }

  changeTime(date) {
    if (date !== null) {
      return date.split("T").length > 1
        ? date.split("T")[1].replace(":00.000Z", "")
        : "0";
    } else {
      return 0;
    }
  }

  changeDate(date) {
    let today = new Date(date);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    let hh: any = today.getHours();
    let mi: any = today.getMinutes();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (hh < 10) {
      hh = "0" + hh;
    }
    if (mi < 10) {
      mi = "0" + mi;
    }
    return yyyy + "/" + mm + "/" + dd + "T" + hh + ":" + mi;
  }

  changeDateWithDash(date) {
    let today = new Date(date);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    let hh: any = today.getHours();
    let mi: any = today.getMinutes();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (hh < 10) {
      hh = "0" + hh;
    }
    if (mi < 10) {
      mi = "0" + mi;
    }
    return yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + mi;
  }

  getCorrectDate(date) {
    let today = new Date(date);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    return yyyy + "/" + mm + "/" + dd;
  }

  getTime(date) {
    if (date) {
      let d = new Date(date);
      return `${d.getHours()}:${d.getMinutes()}`;
    }
    return "";
  }

  getHours(date) {
    if (date) {
      let d: any = new Date(date);
      if(d < 10) {
          d = -d
      }
      return `${d.getHours()}`;
    }
    return "";
  }

  isoDate(date) {
    let today = new Date(date);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    let hh: any = today.getHours();
    let mi: any = today.getMinutes();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
  }

  convertDate(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("/");
  }

  clear() {
    for (let item in this.timeSheet) {
      this.timeSheet[item] = "";
    }
  }
  clickEvent(e) {
    this.clickedDate = e;
      
    this.service.getServerDate().subscribe(data => {
      this.dateServer = data['data']
      if(this.dateServer.slice(0,10) == this.changeDateWithDash(this.clickedDate).slice(0,10)){  
        $('.hide_time_btn').removeClass('hideBtn')
        $('.hide_time_btn').addClass('displayBtn')
      }
      else{
        $('.hide_time_btn').removeClass('displayBtn')
        $('.hide_time_btn').addClass('hideBtn')
      }
    })

      //get all showing days
      var elements = $(".cal-day-headers");
      let days:any = elements.children();
      for(let day of days){
        let date = day.innerHTML.match(/\<span\>(.*)\<\/span\>/).pop();
        let currentMonth = (new Date()).getMonth();
        let showedMonth = (new Date("1991 "+date)).getMonth();        
      }      
      this.clickedLoadHoursOfDay();      
  }

  showLogout(){
    ($("#logoutModal") as any).modal("show");
  }

  logout(){
    localStorage.setItem('token','');
    this.router.navigate(['/login']);
    ($("#logoutModal") as any).modal("hide");
  }

  duration(srt) { 
    var duration = srt.toString()
      let min = duration.slice(-2)   
      let hr = duration.slice(-3,-2) 
      if (min < 10) {
        min = "0" + min;
      }  
      if (hr < 10) {
        hr = "0" + hr;
      }  
      return `${hr} hrs ${min} min`;
  }

  xxxx(sec_num) {
    // var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600)as any;
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60)as any;
    var seconds = sec_num - (hours * 3600) - (minutes * 60)as any;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

  deleteTimeSheet(item) {
    (alertify as any).confirm("Are You Sure To Delete This Time?", () => {
      this.service.deleteTime(item).subscribe(
        data => {
          if (data["msg"] === "success") {
            if(data['data'][0]['Descr'] === "This record is currently in use") {
              alertify.error(data['data'][0]['Descr']);
              return;
            }
            alertify.success("success");
            ($("") as any).modal("hide");
            this.loadJobs();
            this.loadHoursOfDay();
            this.clickedLoadHoursOfDay();
          } else {
            alertify.error("an error has occurred");
          }
        },
        error => {
          let e = error;
          alertify.error("an error has occurred");
        }
      );
    });
  }
  
  totalTimeDetail(srt) { 
    var duration = srt.toString()
      const min = duration.slice(-4, -2)   
      const hr = duration.slice(-5,-4)   
      return `${hr} :${min}`;
    }

  cancel() {
    this.modal.dismissAll("Reason");
  }
  
  calculateDuration(end , start){
    //get dates
    let endDate = new Date("1991/1/1 "+ end);
    let startDate = new Date("1991/1/1 "+ start);
    //convert to minuets
    let endMin = endDate.getHours() * 60 + endDate.getMinutes();
    let startMin = startDate.getHours() * 60 + startDate.getMinutes();
    //find duration
    let durationMin = endMin - startMin;
    //convert min to time
       
    let hr = Math.floor((durationMin/60))
    let min = (durationMin%60)
    if (hr < 10) {
      hr = ('0' + hr)as any;
    }
    if (min < 10) {
      min = ('0' + min)as any;
    }
    let time = `${hr}:${min}`;
    return time;
  }
  calculateTotal(){
    if(!this.timeStaffs){
      return ''
    }
    let m = 0
    
    for(let i =0 ;i<this.timeStaffs.length;i++){
      let temp = new Date("1991/1/1 "+this.timeStaffs[i]['myDuration']);
        m += (temp.getHours()*60) + (temp.getMinutes());
    }
    
    let hr = Math.floor((m/60))
    let min = (m%60)
    if (hr < 10) {
      hr = ('0' + hr)as any;
    }
    if (min < 10) {
      min = ('0' + min)as any;
    }
    return `${hr}:${min}`;
  }
}
