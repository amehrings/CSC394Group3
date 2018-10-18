import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { skillsSearchService } from '../skills-search.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { MatListOption} from '@angular/material/list';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserComponent } from '../user/user.component';
import * as firebase from 'firebase/app';

export interface DialogData {
  data: string;
}

@Component({
  selector: 'app-dialog-search',
  templateUrl: './dialog-search.component.html',
  styleUrls: ['./dialog-search.component.scss']
})
export class DialogSearchComponent implements OnInit{

  skills: any[];
  startAt = new Subject();
  endAt = new Subject();
  searchSkills: any[];

  constructor(public dialogRef: MatDialogRef<DialogSearchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,     
              private skillsService: skillsSearchService,
              private afs: AngularFirestore
  ) { }

  ngOnInit(){
    this.skillsService.getSkills().subscribe((skills) => {
      this.skills = skills[0].skills;
    });
  }
  
  onNoClick(): void {
    this.dialogRef.close();
    
  }

  search($event) {
    let q = $event.target.value.toLowerCase()
    console.log(q)
    this.startAt.next(q);
    this.endAt.next(q+"\uf8ff");

    this.searchSkills = this.skills.filter(skills=> skills.indexOf(q) !== -1);
    
  }

  selectionChange(option: MatListOption) {
    if(option.selected == true){     
      this.afs.collection('users').doc(firebase.auth().currentUser.uid).update({skills: firebase.firestore.FieldValue.arrayUnion(option.value)});
    }    
  }  

  

}
