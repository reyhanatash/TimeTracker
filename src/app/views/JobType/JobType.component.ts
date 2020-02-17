import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../service/main.service';
import { JobsType } from '../models/Main';
import * as alertify from '../../../assets/alertify.js';
declare const $:any;
@Component({
  templateUrl: './JobType.component.html',
})
export class JobTypeComponent implements OnInit {
  displayedColumns: string[] = [
    "typeDesc",
    "actions"
  ];
  dataSource: MatTableDataSource<JobsType>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  jobsType: JobsType;
  src;
  editedId;
  editMode;
  jobTypeId;
  constructor(
    private service: MainService,
    private activatedRoute: ActivatedRoute
  ) {
    this.jobsType = new JobsType();
  }

  ngOnInit() {
    //get result from api
    this.loadJobType();
  }

  loadJobType() {
    this.service.loadJobType().subscribe(data => {
      this.src = data["data"];
      const jobsType = this.src.map(data => {
        return {
          jobTypeCo: data.FldPkJobTypeCo,
          typeDesc: data.FldJobTypeDesc,
        };
      });
      this.dataSource = new MatTableDataSource(jobsType);
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

  newJobType() {
    ($('#jobTypeModal')as any).modal('show');
    this.clear();
    this.editMode = false;
  }

  editJobType(row) {
    this.editedId = row.jobTypeCo
    this.editMode = true;
    ($('#jobTypeModal')as any).modal('show');
    this.jobsType.typeDesc = row.typeDesc;
  }

  saveJobsType() {
    if(this.jobsType.typeDesc === null || this.jobsType.typeDesc === undefined ) {
      alertify.error('Jobs Type field is required')
      return false
    }
    if(this.editMode) {
      this.jobTypeId = this.editedId
    } 
    else {
      this.jobTypeId = -1
    }
    let data = {
      jobTypeCo: this.jobTypeId,
      typeDesc: this.jobsType.typeDesc,
    };
    this.service.saveJobsType(data).subscribe(
      data => {
        try {
          ($('#jobTypeModal') as any).modal('hide');
          this.clear();
          alertify.success('success');
          this.loadJobType();
        } catch {
          alertify.error('an error has occurred');
        }
      },
      error => {}
    );
  }

  deleteJobType(id) {
    (alertify as any).confirm("Are You Sure To Delete This Job Type?", () => {
      this.service.deleteJobType(id).subscribe(
        data => {          
          if (data["msg"] === "success") {
            if(data['data'][0]['Descr'] === "This record is currently in use") {
              alertify.error(data['data'][0]['Descr']);
              return;
            }
            alertify.success("success");
            ($("") as any).modal("hide");
            this.loadJobType();
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
    for (let item in this.jobsType) {
      this.jobsType[item] = "";
    }
  }
}
