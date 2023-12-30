import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginUser } from '../Model/user';
import { BehaviorSubject, catchError, filter, find, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private _http:HttpClient) { }
  behaviorSubject = new BehaviorSubject<string | null>(null);
  loggedInUser$ = this.behaviorSubject.asObservable();

  envUrl:string="https://moderndictionary-5869f-default-rtdb.firebaseio.com/";

  getExistingUsers(){
    const headers = new HttpHeaders().append('Content-Type','application/json');
    return this._http.get(this.envUrl+"Users.json",{headers}).pipe(map(data=>{
      return Object.keys(data)
    }));
  }
  
  loginUser(loginUserDetails:ILoginUser){
    const headers = new HttpHeaders().append('Content-Type','application/json');
    return this._http.get<ILoginUser>(this.envUrl+"Users/"+loginUserDetails.userName+".json",{headers}).
    pipe(find(x=>x.userName == loginUserDetails.userName),
    map((data)=>{
      if(data?.password==btoa(loginUserDetails.password)){
        return true;
      }
      return false;
    }));
  }

  registerUser(userDetails:ILoginUser){
    const headers = new HttpHeaders().append('Content-Type','application/json');
    return this._http.put(this.envUrl+"Users/"+userDetails.userName.toLocaleLowerCase()+".json",userDetails,{headers});
  }

  storeUserName(userName:string){
    localStorage.setItem("userName",userName);
  }
  
  getUserName():string{
    this.behaviorSubject.next(localStorage.getItem("userName"));
    return localStorage.getItem("userName")!;
  }
}
