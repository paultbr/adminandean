import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-resultado',
  templateUrl: './dialogo-resultado.component.html',
  styleUrls: ['./dialogo-resultado.component.css']
})
export class DialogoResultadoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogoResultadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
