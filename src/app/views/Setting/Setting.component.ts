import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { MainService } from "../service/main.service";
import { Setting } from "../models/Main";
import * as alertify from "../../../assets/alertify.js";
import * as moment from "moment";
import * as sha256 from 'sha256/lib/sha256.js';
declare const $:any;

@Component({
  templateUrl: './setting.component.html',
})
export class SettingComponent implements OnInit {
  displayedColumns: string[] = [
    "payPeriod",
    "startingDate",
    "payCycle",
    "accountantName",
    "accountantEmail",    
    "actions"
  ];
  dataSource: MatTableDataSource<Setting>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  setting: Setting;
  src;
  isEdit;
  editedId;
  editMode;
  payPeriod;
  starting;
  payCycle;
  settingDate;
  constructor(
    private service: MainService,
    private activatedRoute: ActivatedRoute
  ) {
    this.setting = new Setting();
  }

  ngOnInit() {
    //get result from api
    this.loadAccSetting();
  }

  loadAccSetting() {
    this.service.loadAccSetting().subscribe(data => {
      this.src = data["data"]
      // this.src.map(x => {
      //   x.fullName = x.FldAccountantName + " " + x.FldAccountantFamily;
      // });
      const accounts = this.src.map(data => {
        return {
          accountantName: data.FldAccountantName,
          accountantEmail: data.FldAccountantEmail,
          payCycle: data.PayCycle,
          payPeriod: data.PayPeriod,
          startingDate: this.changeDate(data.FldStartingDate),
          // accountantPhone: data.FldAccountantPhone,
          // companyName: data.FldCompanyName,
        };
      });
      this.dataSource = new MatTableDataSource(accounts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  newSetting() {
    this.editMode = false;
    ($("#settingModal") as any).modal("show");
    this.clear();
  }
  
  editSetting(row) {
    if(row.startingDate) {
      let d = row.startingDate.split('/');
      this.settingDate = new Date(`${d[2]}/${d[1]}/${d[0]}`);
    }
    this.editMode = true;
    ($('#settingModal')as any).modal('show');
    this.setting.accountantName = row.accountantName;
    this.setting.accountantEmail = row.accountantEmail;
    this.payPeriod = row.payPeriod;
    this.starting = row.starting;
    this.payCycle = row.payCycle;
    this.setting.startingDate = this.settingDate
  }

  addSetting() {
    if(this.setting.accountantName === null || this.setting.accountantName === undefined || this.setting.accountantName === "") {
      alertify.error('Name field is required')
      return false
    }
    if(this.setting.accountantEmail === null || this.setting.accountantEmail === undefined || this.setting.accountantEmail === "") {
      alertify.error('Email field is required')
      return false
    }
    if (!this.checkEmail(this.setting.accountantEmail)) {
      alertify.error('Email is Invalid');
      return false;
    }  
    let data = {
      accountantName: this.setting.accountantName,
      accountantEmail: this.setting.accountantEmail,
      startingDate: moment(this.setting.startingDate).format("YYYY/MM/DD")
    };
    this.service.addSetting(data).subscribe(
      data => {
        try {
          ($("#settingModal") as any).modal("hide");
          this.clear();
          alertify.success("success");
          this.loadAccSetting();
        } catch {
          alertify.error("an error has occurred");
        }
      },
      error => {
        alertify.error(error)
      }
    );
  }

  clear() {
    for (let item in this.setting) {
      this.setting[item] = "";
    }
  }
  changeDate(date) {
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
    return dd + "/" + mm + "/" + yyyy;
  }
  
  checkEmail(email){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
