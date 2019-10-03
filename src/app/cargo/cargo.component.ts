import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog} from '@angular/material';
import { Miga } from '../miga'
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { CargoService } from './cargo.service';
import { DialogoCargoComponent } from './dialogo-cargo/dialogo-cargo.component';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {
  public migas = [ new Miga('Cargos','/cargos')];
  displayedColumns: string[] = ['id', 'amount', 'amount_refunded', 'merchant_message', 'opciones'];
  dataSource : MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  listaCargos : any[]  = [];
  mostrarCargos : boolean = false;

  constructor(public snackBar: MatSnackBar, public cargoService: CargoService, public dialog: MatDialog) {}

  ngOnInit() {
    this.cargoService.getCargos().subscribe( res => {
      const rspta = res as Respuesta;
      if(rspta.status){
        this.listaCargos = rspta.data;
        //console.log(this.listaCargos);
        this.openSnackBar(rspta.status, rspta.msg);
      } else {
        this.openSnackBar(rspta.status, rspta.error);
      }
      this.mostrarCargos = true;
      this.dataSource = new MatTableDataSource(this.listaCargos);   
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    })
  }

  /**
   * Método para filtrar la tabla de datos
   * @param filtro 
   */
  aplicarFiltro(filtro: string){
    this.dataSource.filter = filtro.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Método que muestra un diálogo para mostrar el detalle de un cargo
   * @param idCargo : identificador del cargo
   */
  detalleCargo(idCargo: string){
    this.dialog.open(DialogoCargoComponent, {
      width: '640px',
      data: {
        id: idCargo
      }
    });
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
