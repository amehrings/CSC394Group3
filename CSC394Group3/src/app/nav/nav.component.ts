import { Component, OnInit } from '@angular/core';
import { FirebaseUserModel } from '../core/user.model';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { Location} from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import{ FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private location: Location,
) { }

logout(){
  this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
}
  ngOnInit() {
  }

}
