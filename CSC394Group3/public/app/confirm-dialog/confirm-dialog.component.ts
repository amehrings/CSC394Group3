import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {AuthService} from "../core/auth.service";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(public authService: AuthService,public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick(): void {
    this.authService.doDelete()
      .then((res) => {
      }, (error) => {
        console.log('Delete error', error);
      });
    this.dialogRef.close();
  }
}
