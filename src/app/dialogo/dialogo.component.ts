import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  titulo: string;
  mensaje: string;
}

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styles: []
})
export class DialogoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  declinar(){
    this.dialogRef.close();
  }

}
