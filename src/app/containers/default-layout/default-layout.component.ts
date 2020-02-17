import { Component, OnDestroy, Inject,ElementRef, ViewChild, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import {Router} from '@angular/router';
import { MainService } from '../../views/service/main.service';
declare const alertify: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy,OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      $(".logOutBtn").on("click", ()=>{
        this.logOut()
      });
    }, 1000);

}
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(private mainService: MainService, private router:Router,@Inject(DOCUMENT) _document?: any) {
    
    setTimeout(() => {
      if(localStorage.getItem('type') ===  "3") {
        $('.sidebar').addClass('sidebar_none');
        $('.main').addClass('main_margin');
        $('.app-header').addClass('sidebar_none');
        $('.app-body').addClass('margin_none');
      }
    }, 0);
    
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });

    // router.events.subscribe(val => {
    //  localStorage.getItem('type') === '2' ?  $('.userShow').hide() :  $('.userShow').show();
    // });  
  }


  showSidebar() {
    $('.sidebar').toggleClass('hideSidebar');
  }

  logOut(){
    localStorage.setItem('token','');
    this.router.navigate(['/login'])
  }
  
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
