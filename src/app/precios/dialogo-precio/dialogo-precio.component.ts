import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-precio',
  templateUrl: './dialogo-precio.component.html',
  styleUrls: ['./dialogo-precio.component.css']
})
export class DialogoPrecioComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogoPrecioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
