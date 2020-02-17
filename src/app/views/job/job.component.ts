import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { MainService } from "../service/main.service";
import { Job } from "../models/Main";
import * as alertify from "../../../assets/alertify.js";
import * as moment from "moment";
// import $ from "jquery";
declare const $:any;

@Component({
  templateUrl: "./job.component.html",
  styleUrls: ["./job.component.css"]
})
export class JobComponent implements OnInit {
  displayedColumns: string[] = [
    "jobNumber",
    "clientName",
    "jobTypeDesc",
    "address",
    "startDate",
    "actions"
  ];
  dataSource: MatTableDataSource<Job>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  job: Job;
  src;
  isEdit;
  jobTypes;
  editedId;
  editMode;
  jobId;
  selectedValue = 'Job Type';
  constructor(
    private service: MainService,
    private activatedRoute: ActivatedRoute
  ) {
    this.job = new Job();
  }

  ngOnInit() {
    //get result from api
    this.loadJobs();
    this.loadJobType();
  }

  loadJobs() {
    this.service.loadJobs().subscribe(data => {
      this.src = data["data"];
      const jobs = this.src.map(data => {
        return {
          jobCo: data.FldPkJobCo,
          jobNumber: data.FldJobNumber,
          jobTypeCo: data.FldPkJobTypeCo,
          jobTypeDesc: data.FldJobTypeDesc,
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

  loadJobType() {
    this.service.loadJobType().subscribe(data => {
      this.jobTypes = data["data"];
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  newJob() {
    this.editMode = false;
    ($("#jobModal") as any).modal("show");
    this.clear();
  }

  editJob(row) {
    let d = row.startDate.split('/');
    this.editedId = row.jobCo
    this.editMode = true;
    ($('#jobModal') as any).modal('show');
    this.job.jobNumber = row.jobNumber;
    this.job.jobTypeCo = row.jobTypeCo;
    this.job.clientName = row.clientName;
    this.job.address = row.address;
    this.job.startDate = new Date(`${d[2]}/${d[1]}/${d[0]}`);
  }

  saveJob() {
    if (this.editMode) {
      this.jobId = this.editedId
    }
    else {
      this.jobId = -1
    }
    if(this.job.jobNumber === null || this.job.jobNumber === undefined || this.job.jobNumber === "") {
      alertify.error('Job number field is required')
      return false
    }
    if(this.job.clientName === null || this.job.clientName === undefined || this.job.clientName === "") {
      alertify.error('Client name field is required')
      return false
    }
    if(this.job.address === null || this.job.address === undefined || this.job.address === "") {
      alertify.error('Address field is required')
      return false
    }
    if(this.job.startDate === null || this.job.startDate === undefined || this.job.startDate === "") {
      alertify.error('Start date field is required')
      return false
    }
    let data = {
      jobCo: this.jobId,
      jobNumber: this.job.jobNumber,
      jobTypeCo: this.job.jobTypeCo,
      clientName: this.job.clientName,
      address: this.job.address,
      startDate: moment(this.job.startDate).format("YYYY/MM/DD")
    };
    this.service.saveJob(data).subscribe(
      data => {
        try {
          ($("#jobModal") as any).modal("hide");
          this.clear();
          alertify.success("success");
          this.loadJobs();
        } catch {
          alertify.error("an error has occurred");
        }
      },
      error => {
        alertify.error(error)
      }
    );
  }

  deleteJob(id) {
    (alertify as any).confirm("Are You Sure To Delete This Job?", () => {
      this.service.deleteJob(id).subscribe(
        data => {
          if (data["msg"] === "success") {
            if(data['data'][0]['Descr'] === "This record is currently in use") {
              alertify.error(data['data'][0]['Descr']);
              return;
            }
            alertify.success("success");
            ($("") as any).modal("hide");
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
    for (let item in this.job) {
      this.job[item] = "";
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
}
