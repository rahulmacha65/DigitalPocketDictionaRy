import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(private _route:Router,private _authService:AuthService){}

  title = 'Dictionary';
  userName!:string;
  loggingOut:boolean=false;

  ngOnInit(): void {
    this._authService.loggedInUser$.subscribe(data=>{
      if(data!=null){
        this.userName=data;
        console.log(this.userName);
      }
    });
  }
  


  showLogout(){
    this.loggingOut=(this.loggingOut)?false:true;
  }
  Logout(){
    this._route.navigateByUrl('login');
    this.userName="";
    localStorage.clear();
    this.loggingOut=false;
  }
}
