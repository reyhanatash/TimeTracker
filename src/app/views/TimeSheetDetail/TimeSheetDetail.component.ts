import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../service/main.service';
import { TimeSheet } from '../models/Main';
import * as alertify from '../../../assets/alertify.js';
import * as moment from "moment";
import { GlobalService } from "../../global.service";
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: 'app-TimeSheetDetail',
  templateUrl: './TimeSheetDetail.component.html',
})
export class TimeSheetDetailComponent implements OnInit {
  displayedColumns: string[] = [
    "date",
    "startDate",
    "endDate",
    "duration",
    "jobNumber",
    "activity",
    "note",
    "actions"
  ];
  dataSource: MatTableDataSource<TimeSheet>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  timeSheet: TimeSheet;
  staffs;
  editedId;
  editMode;
  timeSheetId;
  jobs;
  selectedJobValue = 'Job #';
  selectedActivityValue = 'Activity';
  selectedStaffValue = 'Staff';
  activities;
  src;
  monthInfo;
  staffNo;
  hOfD;
  staffId;
  date;
  backDate;
  staffData;
  staffName;
  staffFamily;
  staffNumber;
  staffCo;
  months;
  monthNo;
  monthStartTime;
  monthEndTime;
  dayEndDate;
  monthEndDate;
  yearEndDate;
  payPeriod;
  DateEndHours;
  DateEndMinutes;
  DateStartHours;
  DateStartMinutes;
  totalTime;
  staffTotalTime;
  dateServer;
  timeSheetCo;
  getTodayDate = new Date();
  todayDate = moment(this.getTodayDate).format("YYYY/MM/DD");
  monthsName = new Map([
    ["1", "JAN"],
    ["2", "FEB"],
    ["3", "MAR"],
    ["4", "APR"],
    ["5", "MAY"],
    ["6", "JUN"],
    ["7", "JUL"],
    ["8", "AUG"],
    ["9", "SEP"],
    ["10", "OCT"],
    ["11", "NOV"],
    ["12", "DEC"]
  ]);
  nameOfday = new Map([
    ["0", "SUN"],
    ["1", "MON"],
    ["2", "TUE"],
    ["3", "WED"],
    ["4", "THU"],
    ["5", "FRI"],
    ["6", "SAT"],
  ])
  totalPerTime;
  showEndDate;
  showStartDate;
  subMinutes;
  subHours;
  constructor(
    private service: MainService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    public global: GlobalService
  ) {
    this.timeSheet = new TimeSheet();
  }

  ngOnInit() {
    let staffId = this.activatedRoute.snapshot.paramMap.get('id');
    this.staffCo = staffId;
    this.staffId = staffId;
    this.staffId = this.activatedRoute.snapshot.paramMap.get("id");
    this.date = this.activatedRoute.snapshot.paramMap.get("rowId").replace(/-/g, "/");
    this.loadStaff();
    this.loadJobs();
    this.loadActivity();
    this.loadTimeSheetStaff();
    this.loadHoursOfDay();
    this.loadMonthId();
    
    this.service.loadStaff().subscribe(data => {
      this.staffData = data["data"].find(x => x.FldPkStaffCo == +staffId);
      this.staffName = data["data"].find(x => x.FldPkStaffCo == +staffId)[
        "FldName"
      ];

      this.staffFamily = data["data"].find(x => x.FldPkStaffCo == +staffId)[
        "FldFamily"
      ];

      this.staffNumber = data["data"].find(x => x.FldPkStaffCo == +staffId)[
        "FldPkStaffCo"
      ];

    });

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
        this.staffTotalTime = data["data"].find(x => x.FldPkStaffCo == +staffId)[
          "Duration"
        ];
      });
    });

  }

  
  loadMonthId() {
    this.service.getServerDate().subscribe(data => {
      this.dateServer = data['data']
    })
    this.service.loadMonthId(this.changeDate(this.dateServer)).subscribe(data => {
      this.months = data["data"];
      this.months.map(data => {
        let showDate = new Date(data.FldEndDate);
        let showStartDate = new Date(data.FldEndDate);
        this.monthNo = data.FldPkMonthCo;
        this.monthStartTime = this.getTime(data.FldStartDate);
        this.monthEndTime = this.getTime(data.FldEndDate);
        this.dayEndDate = showDate.getDate();
        this.monthEndDate = this.getNameMonth(showDate.getMonth() + 1);
        this.yearEndDate = showDate.getFullYear();
        this.payPeriod = data.PayPeriod;
        this.DateEndHours = showDate.getHours();
        this.DateEndMinutes = showDate.getMinutes();
        this.DateStartHours = showStartDate.getHours();
        this.DateStartMinutes = showStartDate.getMinutes();
        this.totalTime = `${(this.DateEndHours - this.DateStartHours)}:${(this.DateEndMinutes - this.DateStartMinutes)}`;
      });
    });
  }

  loadStaff() {
    this.service.loadStaff().subscribe(data => {
      this.staffs = data["data"];      
    });
  }  

  loadHoursOfDay() {
    const date = this.date;
    const staffId = this.staffId;
    this.service.loadHoursOfDay(staffId, date).subscribe(data => {
      this.hOfD = data;
      this.src = data["data"]
      let totalPerTimes = 0
      for (let i = 0; i < this.src.length; i++) {
        totalPerTimes += parseInt(this.src[i]['Duration']);
        this.totalPerTime = this.totalTimeDetail(totalPerTimes)
      }

      const timeStaffs = this.src.map(data => {
        return {
          activity: data.FldActivityDesc,
          date: this.fullDate(data.FldDate),
          endDate: this.getTime(data.FldOut),
          jobNumber: data.FldJobNumber,
          startDate: this.getTime(data.FldIn),
          staffCo: data.FldPkStaffCo,
          duration: this.duration(data.Duration),
          note: data.FldNote, 
          FldPkJobCo: data.FldPkJobCo,
          FldPkActivityCo: data.FldPkActivityCo,
          FldPkTimeSheetCo:data.FldPkTimeSheetCo
        };
      });
      this.dataSource = new MatTableDataSource(timeStaffs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  loadTimeSheetStaff() {
    this.service.getServerDate().subscribe(data => {
      this.dateServer = data['data']
    })
    this.service.loadMonthId(this.changeDate(this.dateServer)).subscribe(data => {
      this.src = data["data"];
      this.monthInfo = this.src.map(data => {
        return {
            endDate: data.FldEndDate,
            monthId: data.FldMonthID,
            monthCo: data.FldPkMonthCo,
            startDate: data.FldStartDate,
            year: data.FldYear,
        }
      })
      let monthCo = this.monthInfo[0].monthCo;
      this.service.loadTimeSheetStaff(monthCo).subscribe(data => {
        this.src = data["data"];
      });
    });
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  newTask() {
    this.editMode = false;
    ($('#timeSheetGridModal') as any).modal('show');
    this.clear();
    // let today = new Date();
    // this.timeSheet.date = moment(today).format("YYYY/MM/DD")
  }

  editTimeSheet(row) {
    this.editMode = true;
    this.backDate = this.createNewFormat(row.date);
    ($('#timeSheetGridModal') as any).modal('show');
    this.timeSheet.jobCo = +row.FldPkJobCo;
    this.timeSheet.activityCo = row.FldPkActivityCo;
    this.timeSheet.date = new Date(this.backDate);
    this.timeSheet.startTime = new Date("2000/01/01 " + row.startDate);
    this.timeSheet.endTime = new Date("2000/01/01 " + row.endDate);
    this.timeSheet.note = row.note;
    // this.timeSheet.timeSheetCo = row.FldPkTimeSheetCo
    this.editedId = row.FldPkTimeSheetCo

  }

  saveTimeSheet() {
    if(this.editMode) {
      this.timeSheetCo = this.editedId
    } 
    else if(!this.editMode) {
      this.timeSheetCo = -1
    }
    if(this.timeSheet.jobCo === null || this.timeSheet.jobCo === undefined) {
      alertify.error("Job number field is required")
      return false
    }
    if(this.timeSheet.activityCo === null || this.timeSheet.activityCo === undefined) {
      alertify.error("Activity field is required")
      return false
    }
    // if(this.timeSheet.date === null || this.timeSheet.date === undefined || this.timeSheet.date === "") {
    //   alertify.error("Date is required")
    //   return false
    // }
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
    const staffId = this.staffId
    let data = {
      timeSheetCo: this.timeSheetCo,
      jobCo: this.timeSheet.jobCo,
      staffCo: staffId,
      activityCo: this.timeSheet.activityCo,
      note: this.timeSheet.note,
      date: moment(this.timeSheet.date).format("YYYY/MM/DD"),
      // startTime: (this.timeSheet.startTime as any).toLocaleString(),
      // endTime: (this.timeSheet.endTime as any).toLocaleString(),
      startTime: this.isoDate(this.timeSheet.startTime),
      endTime: this.isoDate(this.timeSheet.endTime),
    };
    this.service.addTimeSheet(data).subscribe(
      data => {
        try {
          // if (data["msg"] === "success") {
            if(data['data'][0]['Descr'] === "This time has overlaps with others.") {
              alertify.error(data['data'][0]['Descr']);
              return;
            }
            if(data['data'][0]['MESSAGE'] === 1) {
              ($('#timeSheetGridModal') as any).modal('hide');
              this.clear();
              alertify.success('success');
            }
          // }
          else {
            alertify.error('Error');
          }
          this.loadHoursOfDay()
        } catch {
          alertify.error('an error has occurred');
        }
      },
      error => {}
    );
  }

  deleteTimeSheet(row) {
    (alertify as any).confirm("Are You Sure To Delete This Time Sheet?", () => {
      this.service.deleteJob(row).subscribe(
        data => {
          if (data["msg"] === "success") {            
            alertify.success("success");
            ($("timeSheetGridModal") as any).modal("hide");
            this.loadJobs();
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

  clear() {
    for (let item in this.timeSheet) {
      this.timeSheet[item] = "";
    }
  }

  backBtn() {
    this.router.navigate([`/timeSheet/${this.staffId}`]);
  }

  changeTime(date) {
    if(date !== null) {
      return date.split("T")[1].replace(":00.000Z", "")
    }
    else {
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
    return yyyy + "/" + mm + "/" + dd;
  }
  async downloadTimeSheet() {
    //get info from api
    let currentMonth = new Date().getMonth() + 1;

    this.service.getServerDate().subscribe(data => {
      this.dateServer = data['data']
    })
    let m = await this.service.loadMonthId(this.changeDate(this.dateServer)).toPromise();
    let data = this.hOfD['data'];
    //generate pdf
    var doc = new jsPDF();
    var col = [
      "DATE",
      "Started",
      "Ended",
      "Duration",
      "Job",
      "Activity",
    ];

    var rows = [];
    var rowCountModNew = [];
    for (let item of data) {
      rowCountModNew.push([
        new Date(item["FldDate"]).toDateString(),
        this.getTime(item["FldIn"]) || "-",
        this.getTime(item["FldOut"]) || "-",
        item["Duration"],
        item["FldJobNumber"],
        item["FldActivityDesc"],
      ]);
    }
    rowCountModNew.forEach(element => {
      rows.push(element);
    });
    // doc.line(0, 0, 0, 0);
    doc.autoTable(col, rows, {
      didParseCell: function (info) {
        var rows = info.table.body;
        if (info.row['raw'][0] === "DATE") {
          info.cell.styles.fillColor = "#14d714";
          info.cell.styles.textColor = "#5a5a5a";
        }
    },
      styles: { 
        overflow: "linebreak",
        cellWidth: "wrap",
        lineWidth: 0.5,
        lineColor: "#14d714",
    },
      startY: 35,
      startX: 5,
      margin: { top: 35 },
      pageBreak: "auto",
      columnStyles: {
        0: {
          columnWidth: 30
        },
        1: {
          columnWidth: 30
        },
        2: {
          columnWidth: 30
        },
        3: {
          columnWidth: 30
        },
        4: {
          columnWidth: 30
        },
        5: {
          columnWidth: 30
        },
        6: {
          columnWidth: 30
        },
        7: {
          columnWidth: 30
        }
      },
      didDrawPage: () => {
        var base64Img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMxMTkyMTVDQ0I2NDExRTk4MjI4Q0M5NjZCREUzMkM3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMxMTkyMTVEQ0I2NDExRTk4MjI4Q0M5NjZCREUzMkM3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzExOTIxNUFDQjY0MTFFOTgyMjhDQzk2NkJERTMyQzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzExOTIxNUJDQjY0MTFFOTgyMjhDQzk2NkJERTMyQzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4rNaQbAAARMElEQVR42uxd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'
          doc.setFontSize(10);
          doc.setTextColor(40);
          doc.setFontStyle('normal');
          if (base64Img) {
            doc.addImage(base64Img, 'JPEG', 10, 10, 30, 30);
          }
          doc.setFontType('bold')
          doc.text(
            `\nStaff Name : ${this.staffName} ${this.staffFamily}\n`,
            146,
            10,
            'left'
          );
          doc.text(
            `Pay Period ${this.payPeriod} from 1 ${this.monthEndDate} ${this.yearEndDate} to ending 30 ${this.monthEndDate} ${this.yearEndDate}\n`,
            102,
            25,
          );
          doc.setLineWidth(7);
          doc.rect(-5, 0, doc.internal.pageSize.width + 100, doc.internal.pageSize.height +20, 'S');
      }
    });

    // var data = doc.output('blob');
    doc.save(`Report.pdf`);

    //download file
  }
  getTime(date) {
    if (date) {
      const d = date.slice(11, 16)   
      return d;
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

  getNameDay(dayNo) {
    for (let i = 0; i < 7; i++) {
      if (dayNo == i) {
        return this.nameOfday.get(`${i}`);
      }
    }
  }

  getNameMonth(monthNo) {
    for (let i = 0; i <= 12; i++) {
      if (monthNo == i) {
        return this.monthsName.get(`${i}`);
      }
    }
  }

  getNoMonth(monthName) {
    const s = 
    [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ]
    for (let i = 0; i < 12; i++) {
      if (monthName == s[i]) {
        return i+1;
      }
    }
  }

  fullDate(date) {
    let today = new Date(date);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let month = this.getNameMonth(mm);
    let day = today.getDay();
    let nameDay = this.getNameDay(day);

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    return `${dd} ${month},${yyyy}-${nameDay}`; 
  }
  
  createNewFormat(srt) {
    var day = srt.slice(0, 2);
    var month = srt.slice(3, 6);
    var year = srt.slice(7, 11);
    let dd:any = day
    let mm:any = month
    let yyyy:any = year

    let monthName = this.getNoMonth(mm)

    return `${yyyy}/${monthName}/${dd}`;
  }
  
  duration(srt) { 
    var duration = srt.toString()
    // for (let i = 0; i < duration.length; i++) {
      let min = duration.slice(-4, -2)   
      let hr = duration.slice(-5,-4)   
      if(hr < 10) {
        hr = '0'+ hr
      }
      return `${hr}:${min}`;
  //  }
  }
  
  totalTimeDetail(srt) { 
    var duration = srt.toString()
    // for (let i = 0; i < duration.length; i++) {
      let min = duration.slice(-4, -2)   
      let hr = duration.slice(-5,-4)   
      // if(min < 10) {
      //   min = '0'+ min
      // }
      if(hr < 10) {
        hr = '0'+ hr
      }
      return `${hr} :${min}`;
  //  }
  }

  
  getHours(srt) { 
    var duration = srt.toString()
    let hr = duration.slice(11,13)   
      if (hr < 10) {
        hr = "0" + hr;
      }  
      return `${hr}`;
  }

  getMinutes(srt) { 
    var duration = srt.toString()
    let min = duration.slice(14,16)   
    // let hr = duration.slice(-3,-2) 
      if (min < 10) {
        min = "0" + min;
      }   
      return `${min}`;
  }

}

