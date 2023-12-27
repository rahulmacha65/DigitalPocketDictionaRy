import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { ILoginUser } from '../Model/user';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit,OnDestroy {

  loginForm!:FormGroup;
  registerForm!:FormGroup;
  userLogin:boolean=true;
  existingUsers:Array<string> | undefined;
  constructor(private _fb:FormBuilder,private _snackBar:MatSnackBar,private _router:Router,private _authService:AuthService) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      userName:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(8)]]
    });

    this.registerForm = this._fb.group({
      userName:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(8)]],
      confirmPassword:['',Validators.required,this.customPasswordMatch.bind(this)]
    });

    this.getAllUsers();
  }

  getAllUsers(){
    this._authService.getExistingUsers().subscribe(data=>{
      this.existingUsers = data;
      console.log(this.existingUsers);
    });
  }

  get email(){
    return this.loginForm.get('userName');
  }
  get password(){
    return this.loginForm.get('password');
  }

  get registerEmail(){
    return this.registerForm.get('userName');
  }
  get registerPassword(){
    return this.registerForm.get('password');
  }
  get confirmPassword(){
    return this.registerForm.get('confirmPassword');
  }

  login(){
    if(this.loginForm.invalid){
      this._snackBar.open('Please enter required fields!','Dismiss');
      return;
    }
    this.loginForm.value.userName = this.loginForm.value.userName.split('@')[0].toLowerCase();
    const loginUserDetails:ILoginUser = this.loginForm.value;
    
    if(!this.existingUsers?.find(x=>x==loginUserDetails.userName.toLowerCase())){
      this._snackBar.open("Email or password doesn't exists in the application. Please register!!","Dismiss");
    }
    else{
      this._authService.loginUser(loginUserDetails).subscribe({
        next:data=>{
          if(data==true){
            this._router.navigateByUrl("/home");
          }else{
            this._snackBar.open("Login failed!! email or password is wrong.","Dismiss");
          }
        },
        error:error=>{
          console.log(error)
          this._snackBar.open("Authentication error occured please try after some time !!","Dismiss");
        }
      })
    }

  }

  registerUser(){
    if(this.registerForm.invalid){
      this._snackBar.open('Please enter required fields!','Dismiss');
      return;
    }

    this.registerForm.value.userName = this.registerForm.value.userName.split("@")[0];
    const registerUserDetails:ILoginUser= this.registerForm.value;
    delete this.registerForm.value.confirmPassword;

    if(this.existingUsers?.find(x=>x==registerUserDetails.userName)){
      this._snackBar.open("Email already exists. Please login or user different email.","Dismiss");
      return;
    }
    
    registerUserDetails.password = btoa(registerUserDetails.password);
    console.log(registerUserDetails);

    this._authService.registerUser(registerUserDetails).subscribe({
      next:(data)=>{
        this._snackBar.open("Registration Successful","Dismiss")
        this._router.navigateByUrl("/home");
      },
      error:(error)=>{
        console.log(error);
        this._snackBar.open(error,"Dismiss");
      }
    });

  }

  register(){
    this.userLogin=false;
  }
  loginUser(){
    
    this.userLogin=true;
  }

  private customPasswordMatch(control:FormControl):Promise<{[s:string]:boolean} |null>{
    const p = new Promise<{[s:string]:boolean} |null>(reslove=>{
      if(control.value != this.registerPassword?.value){
        reslove({customError:true});
      }
      reslove(null);
    });
    return p;
  }

  ngOnDestroy(): void {
    this._snackBar.ngOnDestroy();
  }
}
