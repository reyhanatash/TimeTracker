import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { MainService } from "../service/main.service";
import { Account } from "../models/Main";
import * as alertify from "../../../assets/alertify.js";
import * as moment from "moment";
import * as sha256 from 'sha256/lib/sha256.js';

@Component({
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  displayedColumns: string[] = [
    "companyName",
    "adminName",
    "adminEmail",
    "adminPhone",
    "actions"
  ];
  dataSource: MatTableDataSource<Account>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  account: Account;
  src;
  isEdit;
  editedId;
  editMode;
  accountId;
  pass;
  constructor(
    private service: MainService,
    private activatedRoute: ActivatedRoute
  ) {
    this.account = new Account();
  }

  ngOnInit() {
    //get result from api
    this.loadAccSetting();
  }

  loadAccSetting() {
    this.service.loadAccSetting().subscribe(data => {
      this.src = data["data"]
      const accounts = this.src.map(data => {
        return {
          adminName: data.FldAdminName,
          adminEmail: data.FldAdminEmail,
          adminPhone: data.FldAdminPhone,
          companyName: data.FldCompanyName,
        };
      });
      this.dataSource = new MatTableDataSource(accounts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadJobs() {
    this.service.loadJobs().subscribe(data => {
      this.src = data["data"];
      const jobs = this.src.map(data => {
        return {
          jobCo: data.FldPkJobCo,
          jobNumber: data.FldJobNumber,
          jobTypeCo: data.FldFkJobTypeCo,
          clientName: data.FldClient,
          address: data.FldAddress,
          startDate: this.changeDate(data.FldStartDate)
        };
      });
      this.dataSource = new MatTableDataSource(jobs);
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

  newAccount() {
    this.editMode = false;
    ($("#accountModal") as any).modal("show");
    this.clear();
  }
  
  editAccount(row) {
    this.editMode = true;
    ($('#accountModal')as any).modal('show');
    this.account.adminName = row.adminName;
    this.account.adminEmail = row.adminEmail;
    this.account.adminPhone = row.adminPhone;
    this.account.companyName = row.companyName;
    if(this.account.password === undefined) {
      this.account.password === ""
    }
  }

  addAccount() {
    if(this.account.password) {
      if(this.account.password !== null || this.account.password !== undefined){
        this.pass = sha256(this.account.password)
      }
    }
    else {
      this.pass = ""
    }
    if(this.account.adminName === null || this.account.adminName === undefined || this.account.adminName === "") {
      alertify.error('Name field is required')
      return false
    }
    if(this.account.adminEmail === null || this.account.adminEmail === undefined || this.account.adminEmail === "") {
      alertify.error('Email field is required')
      return false
    }
    if(this.account.adminPhone === null || this.account.adminPhone === undefined || this.account.adminPhone === "") {
      alertify.error('Phone field is required')
      return false
    }
    if (!this.checkEmail(this.account.adminEmail)) {
      alertify.error('Email is Invalid');
      return false;
    }
    // if (this.account.password === null || this.account.password === undefined) {
    //   this.account.password === ""
    // }
    if(!this.editMode) {
      if (this.account.password === null  || this.account.password === undefined) {
        alertify.error('Password is required field');
        return false;
      } 
    }  
    let data = {
      adminName: this.account.adminName,
      adminEmail: this.account.adminEmail,
      adminPhone: this.account.adminPhone,
      companyName: this.account.companyName,
      password: this.pass,      
    };
    this.service.addAccount(data).subscribe(
      data => {
        try {
          ($("#accountModal") as any).modal("hide");
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
    for (let item in this.account) {
      this.account[item] = "";
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
