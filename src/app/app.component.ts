import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private _route:Router){}
  title = 'Dictionary';
  loggingOut:boolean=false;
  showLogout(){
    this.loggingOut=(this.loggingOut)?false:true;
  }
  Logout(){
    this._route.navigateByUrl('login');
    this.loggingOut=false;
  }
}
