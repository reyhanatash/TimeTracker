import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  templateUrl: '404.component.html',
  styleUrls: ['./error.component.css']
})
export class P404Component {
  constructor(private router:Router) {}

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}