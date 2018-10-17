import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentSnapshot  } from 'angularfire2/firestore';
import { Observable} from 'rxjs';
import { Response } from '@angular/http';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class skillsSearchService {
  dbSkills: any[];

  constructor(private db: AngularFirestore) { }

  getSkills(): Observable<any> {
    //const firestore = firebase.firestore();
     
    //const query = firestore.collection('skills').where('myskills', '==', )

    //return this.db.collection('skills', ref => ref.limit(10).orderBy('skills').startAt(start).endAt(end)).valueChanges();
    return this.db.collection<any>('/skills', ref => 
    ref).valueChanges();
  }

  getUserSkills(): any[] {
    const firestore = firebase.firestore();
    var db = firestore.collection('/users').doc(firebase.auth().currentUser.uid).get().then(function(doc) {
      console.log(doc.data().skills)
      this.dbSkills= doc.data().skills
    })
    return this.dbSkills;
  }

}