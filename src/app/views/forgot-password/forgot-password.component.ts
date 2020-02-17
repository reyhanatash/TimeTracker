import { Component, OnInit } from '@angular/core';
import { MainService } from '../service/main.service';
import * as alertify from '../../../assets/alertify.js';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};

  constructor(private service: MainService , private router:Router) {
  }
  

  ngOnInit() {
  }

  changePass() {
    // let data = {
    //   email: this.model.email,
    // };

    this.service.changePassword(this.model.email).subscribe(data => {
      try {
        if(data['data'][0]['Descr']) {
          alertify.error('Your email does not exist');
        }
        alertify.error('Your password was sent');
        this.router.navigate(['/login'])
      } catch {
        alertify.error('an error has occurred');
      }
    })
  }
}
