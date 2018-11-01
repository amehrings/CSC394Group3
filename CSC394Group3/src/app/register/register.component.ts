import {Component, OnInit} from '@angular/core';
import { AuthService } from '../core/auth.service'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  degrees;
  tempDegrees;

  constructor(
    public authService: AuthService,
    private router: Router,
    private form: FormBuilder,
    private db : AngularFirestore
  ) {

   }

   ngOnInit(){
     this.db.collection<any>("/degrees", ref => ref).get().subscribe((degrees) => {console.log(degrees);
     this.degrees = Array(20);
       this.tempDegrees = degrees;
       console.log(this.tempDegrees);
       for(let i =0; i<this.tempDegrees.docs.length; i++){
         console.log(this.tempDegrees.docs[i]);
         this.degrees[i] = this.tempDegrees.docs[i].id;
       }
     });

     //console.log(this.degrees);
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
       this.authService.updateUserData(res.user.email, res.user.uid,this.registerForm.get('degree').value);
       this.errorMessage = "";
       this.successMessage = "Account Created";
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
   }

}
