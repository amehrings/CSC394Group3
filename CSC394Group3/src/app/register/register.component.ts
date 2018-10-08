import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  degrees: Observable<any>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private form: FormBuilder,
    private db : AngularFirestore
  ) {
    this.degrees = db.collection("degree").valueChanges();
    this.createForm();
   }

   createForm() {
     this.registerForm = this.form.group({
       email: ['', Validators.required ],
       password: ['',Validators.required],
       job:[''],
       degree: ['']
     });
   }

   tryRegister(value){
     this.authService.doRegister(value)
     .then(res => {
       console.log(res);
       this.authService.updateUserData(res.user.email, res.user.uid);
       this.errorMessage = "";
       this.successMessage = "Account Created";
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
   }

}
