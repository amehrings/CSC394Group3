import { Component, OnInit } from '@angular/core';
import { FirebaseUserModel } from '../core/user.model';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { skillsSearchService } from '../skills-search.service';
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit{

  skills: any[];
  startAt= new Subject();
  endAt= new Subject();
  searchSkills: any
  result: String;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  

  

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private form: FormBuilder,
    private skillsService: skillsSearchService
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
          this.skillsService.getSkills().subscribe((skills) => {
            this.skills = skills[0].skills;
          })
        })
        this.createForm(this.user.name);
      }
    })
  }

  search($event) {
    let q = $event.target.value
    this.startAt.next(q);
    this.endAt.next(q+"\uf8ff");

    this.searchSkills = this.skills.filter(
      skills => skills.indexOf(q) !== -1
    )
    console.log(q)
  }


  createForm(name) {
    this.profileForm = this.form.group({
      name: [name, Validators.required ]
    });
  }

  save(value){
    this.userService.updateCurrentUser(value)
    .then(res => {
      console.log(res);
    }, err => console.log(err))
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }
}
