import {Component, OnInit} from '@angular/core';
import { MainService } from '../service/main.service';
import * as sha256 from 'sha256/lib/sha256.js';
import {Router} from '@angular/router';
import * as alertify from '../../../assets/alertify.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  private isHuman;
  private isHuman2;
  siteKey = '6LcCUp4UAAAAADaY8CuOgO-SYzIa4mPfzZA06WVr\n';

  constructor(private service: MainService , private router:Router) {
  }
  

  ngOnInit() {    
    let item = localStorage.getItem('token');
      if(item){
        this.router.navigate(['/usersTimesheet']);
      }
  }

  login() {
    // if (!this.isHuman) {
    //   alertify.error('Are you robot?');
    //   return;
    // }
    if(!this.model.username || !this.model.password){
      alertify.error('please enter username and password');
      return;
    }
    let data = {
      username: this.model.username,
      password: sha256(this.model.password)
    };
    this.service.login(data).subscribe(response => {
      if (response['data']['token']) {
        localStorage.setItem('token', response['data']['token']);
        localStorage.setItem('type', response['data']['type']);
        localStorage.setItem('userId', response['data']['userId']);
        localStorage.setItem('staffId', response['data']['staffId']);
        localStorage.setItem('staffFName', response['data']['staffFName']);
        localStorage.setItem('staffLName', response['data']['staffLName']);
        if (localStorage.getItem('type') ===  "3") {
          this.router.navigate(['/staffs']);
        }
        else{
          this.router.navigate(['/usersTimesheet']);
        }
        return;
      }
      if(response['msg'] === "fail") {
        alertify.error('Invalid username and password');
        return;
      }
      alertify.error('an error has occurred');
    })
    // alertify.error('error');
  }

  resolved(captchaResponse: string) {
    this.isHuman = true;
  }

  resolvedRemember(captchaResponse: string) {
    this.isHuman2 = true;
  } 
  
  forgetPass() {
    this.router.navigate(['/forgot-password'])
  }
}
