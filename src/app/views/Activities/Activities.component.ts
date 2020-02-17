import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../service/main.service';
import { Activity } from '../models/Main';
import * as alertify from '../../../assets/alertify.js';

@Component({
  templateUrl: './activities.component.html',
})
export class ActivitiesComponent implements OnInit {
  displayedColumns: string[] = [
    "activityDesc",
    "actions"
  ];
  dataSource: MatTableDataSource<Activity>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  activity: Activity;
  src;
  editedId;
  editMode;
  activityId;
  constructor(
    private service: MainService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activity = new Activity();
  }

  ngOnInit() {
    //get result from api
    this.loadActivity();
  }

  loadActivity() {
    this.service.loadActivity().subscribe(data => {
      this.src = data["data"];
      const activities = this.src.map(data => {
        return {
          activityCo: data.FldPkActivityCo,
          activityDesc: data.FldActivityDesc,
        };
      });
      this.dataSource = new MatTableDataSource(activities);
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

  newActivity() {
    this.editMode = false;
    ($('#activityModal')as any).modal('show');
    this.clear();
  }
  
  editActivity(row) {
    this.editedId = row.activityCo
    this.editMode = true;
    ($('#activityModal')as any).modal('show');
    this.activity.activityDesc = row.activityDesc;
  }

  saveActivity() {
    if(this.activity.activityDesc === null || this.activity.activityDesc === undefined || this.activity.activityDesc === "") {
      alertify.error('Activity description field is required')
      return false
    }
    if(this.editMode) {
      this.activityId = this.editedId
    } 
    else {
      this.activityId = -1
    }
    let data = {
      activityCo: this.activityId,
      activityDesc: this.activity.activityDesc,
    };
    this.service.addActivity(data).subscribe(
      data => {
        try {
          ($('#activityModal') as any).modal('hide');
          this.clear();
          alertify.success('success');
          this.loadActivity();
        } catch {
          alertify.error('an error has occurred');
        }
      },
      error => {}
    );
  }

  deleteActivity(id) {
    (alertify as any).confirm("Are You Sure To Delete This Activity?", () => {
      this.service.deleteActivity(id).subscribe(
        data => {
          if (data["msg"] === "success") {
            if(data['data'][0]['Descr'] === "This record is currently in use") {
              alertify.error(data['data'][0]['Descr']);
              return;
            }
            if (data["data"][0]["message"] === "can not Delete") {
              alertify.error("this task has been assigned to project");
              return;
            }
            alertify.success("success");
            ($("") as any).modal("hide");
            this.loadActivity();
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
    for (let item in this.activity) {
      this.activity[item] = "";
    }
  }
}
