import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { MainService } from "../service/main.service";
import { Staff } from '../models/Main';
import * as alertify from "../../../assets/alertify.js";
import * as sha256 from 'sha256/lib/sha256.js';
declare const $:any;

@Component({
  templateUrl: './staff.component.html',
})
export class StaffComponent implements OnInit {
  displayedColumns: string[] = [
    "firstName",
    "lastName",
    "email",
    "approved",
    "phone",
    "actions"
  ];
  dataSource: MatTableDataSource<Staff>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  staff: Staff;
  src;
  editedId;
  editMode;
  staffId;
  isApprove;
  pass;
  monthInfo;
  dateServer;
  constructor(
    private service: MainService,
    private activatedRoute: ActivatedRoute
  ) {
    this.staff = new Staff();
  }

  ngOnInit() {    
    this.loadStaff();
    this.service.getServerDate().subscribe(data => {
      this.dateServer = data['data']
    })
    this.service.loadMonthId(this.changeDate(this.dateServer)).subscribe(data => {
      this.src = data["data"];
      this.monthInfo = this.src.map(data => {
        return {
          monthCo: data.FldPkMonthCo,
          endMonth: data.FldEndDate,
        };
      });
      
    this.service.getServerDate().subscribe(data => {
      let serverDate = data["data"].slice(5,7)
      const compatDate = this.monthInfo[0].endMonth.slice(5,7)
      if(serverDate ===  compatDate) {
        this.isApprove = false;
        $('.btn_approve').addClass("hide_approved");
      }
      else if(serverDate !==  compatDate) {
        this.isApprove = true;
        $('.btn_approve').addClass("show_approve");
      }
      })
    });

  }

  loadStaff() {
    this.service.loadStaff().subscribe(data => {
      this.src = data["data"];
      const staff = this.src.map(data => {
        return {
          staffCo: data.FldPkStaffCo,
          firstName: data.FldName,
          lastName: data.FldFamily,
          email: data.FldEmail,
          phone: data.FldPhone
        };
      });
      this.dataSource = new MatTableDataSource(staff);
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

  newStaff() {
    this.editMode = false;
    ($('#staffModal')as any).modal('show');
    this.clear();
  }

  editStaff(row) {
    this.editedId = row.staffCo
    this.editMode = true;
    ($('#staffModal')as any).modal('show');
    this.staff.firstName = row.firstName;
    this.staff.lastName = row.lastName;
    this.staff.phone = row.phone;
    this.staff.email = row.email;
    // if(this.staff.password === undefined) {
    //   this.staff.password === ""
    // }
  }
  saveStaff() {
    if(this.staff.firstName === null || this.staff.firstName === undefined || this.staff.firstName === "") {
      alertify.error('First name field is required')
      return false
    }
    if(this.staff.lastName === null || this.staff.lastName === undefined || this.staff.lastName === "") {
      alertify.error('Last name field is required')
      return false
    }
    if(this.staff.email === null || this.staff.email === undefined || this.staff.email === "") {
      alertify.error('Email field is required')
      return false
    }
    if(this.staff.phone === null || this.staff.phone === undefined || this.staff.phone === "") {
      alertify.error('Phone field is required')
      return false
    }
    if(this.editMode) {
      this.staffId = this.editedId
    } 
    else {
      this.staffId = -1
    }    
    if(this.staff.password) {
      if(this.staff.password !== null || this.staff.password !== undefined){
        this.pass = sha256(this.staff.password)
      }
      else {
        this.pass = ""
      }
    }
    else {
      this.pass = ""
    }
    

    if(!this.editMode) {
      if (this.staff.password === null  || this.staff.password === undefined) {
        alertify.error('Password is required field');
        return false;
      } 
    }

    if (!this.checkEmail(this.staff.email)) {
      alertify.error('Email is Invalid');
      return false;
    }    
    let data = {
      staffCo: this.staffId,
      firstName: this.staff.firstName,
      lastName: this.staff.lastName,
      email: this.staff.email,
      phone: this.staff.phone,
      password: this.pass
    };
    this.service.addStaff(data).subscribe(
      data => {
        try {
          if (data['data'][0]['Descr']) {
            alertify.error(data['data'][0]['Descr']); 
            return false           
          }
          // else {}
          ($("#staffModal") as any).modal("hide");
          this.clear();
          alertify.success("success");
          this.loadStaff();
        } catch {
          alertify.error("an error has occurred");
        }
      },
      error => {
        alertify.error(error)
      }
    );
  }

  deleteStaff(id) {
    (alertify as any).confirm("Are You Sure To Delete This Staff?", () => {
      this.service.deleteStaff(id).subscribe(
        data => {
          if (data["msg"] === "success") {
            if(data['data'][0]['Descr'] === "This record is currently in use") {
              alertify.error(data['data'][0]['Descr']);
              return;
            }
            alertify.success("success");
            ($("#staffModal") as any).modal("hide");
            this.loadStaff();
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
    for (let item in this.staff) {
      this.staff[item] = "";
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
  
  checkEmail(email){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
