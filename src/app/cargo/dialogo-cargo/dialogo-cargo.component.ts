import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CargoService } from '../cargo.service';
import { Respuesta } from 'src/app/usuario/respuesta';
import { SnackBarComponent } from '../../snack-bar/snack-bar.component';

@Component({
  selector: 'app-dialogo-cargo',
  templateUrl: './dialogo-cargo.component.html',
  styleUrls: ['./dialogo-cargo.component.css']
})
export class DialogoCargoComponent implements OnInit {
  cargo: any;

  constructor(public dialogRef: MatDialogRef<DialogoCargoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public cargoService: CargoService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.cargoService.getCargo(this.data.id).subscribe( res => {
      const rspta = res as Respuesta;
      if(rspta.status){
        this.cargo = rspta.data
        this.openSnackBar(rspta.status, rspta.msg);
      } else {
        this.openSnackBar(rspta.status, rspta.error);
      }
    })
  }

  /**
   * Salir de la ventana de detalle del cargo
   */
  declinar(){
    this.dialogRef.close();
  }

  /**
   * Método que muestra un bar temporal con un mensaje
   * @param status : indica si es un error o confirmación
   * @param mensaje : texto del mensaje
   */
  openSnackBar(status: boolean, mensaje: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [status ? 'exito' : 'error'],
      data: mensaje
    });
  }
}
