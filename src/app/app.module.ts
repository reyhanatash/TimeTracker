import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { RegisterComponent } from './views/register/register.component';
import { JobComponent } from './views/job/job.component';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LoaderInterceptor} from './views/service/httpinterceptor.service';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { ClientComponent } from './views/Client/Client.component';
import { MainService } from './views/service/main.service';
import { AuthGuardAdimin, AuthGuardUser} from './views/service/auth.guard';
import { CommonModule } from '@angular/common';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { 
  MatInputModule,
  MatOptionModule, 
  MatSelectModule, 
  MatIconModule, 
  MatAutocompleteModule, 
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';
import { OnlyText} from './views/directive/onlyText.directive';
import { RecaptchaModule } from 'ng-recaptcha';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { OnlyNumber} from './views/directive/onlynumber.directive';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { usersTimeSheetComponent } from './views/usersTimeSheet/usersTimeSheet.component';
import { JobTypeComponent } from './views/JobType/JobType.component';
import { ActivitiesComponent } from './views/Activities/Activities.component';
import { StaffComponent } from './views/Staff/Staff.component';
import { AccountComponent } from './views/Account/Account.component';
import { SettingComponent } from './views/Setting/Setting.component';
import { TimeSheetComponent } from './views/TimeSheet/TimeSheet.component';
import { TimeSheetDetailComponent } from './views/TimeSheetDetail/TimeSheetDetail.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'DD/MM/YYYY',
  parseInput: 'DD/MM/YYYY',
  // datePickerInput: 'DD/MM/YYYY HH:mm:ss',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
  };

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    RecaptchaModule,
    InternationalPhoneNumberModule,
    OwlMomentDateTimeModule,
    MatPaginatorModule,
    NgbModalModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [
    AppComponent,
    APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,    
    JobComponent,
    OnlyText,
    OnlyNumber,
    usersTimeSheetComponent,
    JobTypeComponent,
    ActivitiesComponent,
    StaffComponent,
    AccountComponent,
    SettingComponent,
    TimeSheetComponent,
    TimeSheetDetailComponent,
    ClientComponent,
    ForgotPasswordComponent,
  ],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
    AuthGuardAdimin,
    AuthGuardUser,
    MainService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
