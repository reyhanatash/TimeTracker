import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { RegisterComponent } from './views/register/register.component';
import { JobComponent } from './views/job/job.component';
import { usersTimeSheetComponent } from './views/usersTimeSheet/usersTimeSheet.component';
import { TimeSheetComponent } from './views/TimeSheet/TimeSheet.component';
import { JobTypeComponent } from './views/JobType/JobType.component';
import { ActivitiesComponent } from './views/Activities/Activities.component';
import { StaffComponent } from './views/Staff/Staff.component';
import { AccountComponent } from './views/Account/Account.component';
import { SettingComponent } from './views/Setting/Setting.component';
import { ClientComponent } from './views/Client/Client.component';
import { AuthGuardAdimin, AuthGuardUser } from './views/service/auth.guard';
import { TimeSheetDetailComponent } from './views/TimeSheetDetail/TimeSheetDetail.component';


export const routes: Routes = [
  {
     path: 'login',
     component: LoginComponent,
     data: {
      title: 'Login Page'
    }
  },
  {
     path: 'forgot-password',
     component: ForgotPasswordComponent,
     data: {
      title: 'Forgot Password page'
    }
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    canActivate:[AuthGuardAdimin],
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuardAdimin],
        component: usersTimeSheetComponent,
        pathMatch: 'full',
      },
      {
        path: 'job',
        canActivate:[AuthGuardAdimin],
        component: JobComponent,
        data: {
          title: 'Job Page'
        }
      },
      {
        path: 'usersTimesheet',
        canActivate:[AuthGuardAdimin],
        component: usersTimeSheetComponent,
        data: {
          title: 'Time Sheet Page'
        }
      },
      {
        path: 'jobstype',
        canActivate:[AuthGuardAdimin],
        component: JobTypeComponent,
        data: {
          title: 'Jobs Type Page'
        }
      },
      {
        path: 'activities',
        canActivate:[AuthGuardAdimin],
        component: ActivitiesComponent,
        data: {
          title: 'Activities Page'
        }
      },
      {
        path: 'staff',
        canActivate:[AuthGuardAdimin],
        component: StaffComponent,
        data: {
          title: 'Staff Page'
        }
      },
      {
        path: 'account',
        canActivate:[AuthGuardAdimin],
        component: AccountComponent,
        data: {
          title: 'Account Page'
        }
      },
      {
        path: 'setting',
        canActivate:[AuthGuardAdimin],
        component: SettingComponent,
        data: {
          title: 'Setting Page'
        }
      },
      {
        path: 'timeSheet/:id',
        canActivate:[AuthGuardAdimin],
        component: TimeSheetComponent,
        data: {
          title: 'Time Sheet Page'
        }
      },
      {
        path: 'timeSheetDetail/:id/:rowId',
        canActivate:[AuthGuardAdimin],
        component: TimeSheetDetailComponent,
        data: {
          title: 'Time Sheet Page'
        }
      },
      // {
      //   path: 'staffs',
      //   // canActivate:[AuthGuardAdimin],
      //   canActivate:[AuthGuardUser],
      //   component: ClientComponent,
      //   data: {
      //     title: 'Client Page'
      //   }
      // },
      
    ]
  },
  {
    path: '',
    canActivate:[AuthGuardUser],
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'staffs',
        canActivate:[AuthGuardUser],
        component: ClientComponent,
        data: {
          title: 'Client Page'
        }
      },
    ]
  },

  { path: '**', component: P404Component , redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,{useHash: true}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
