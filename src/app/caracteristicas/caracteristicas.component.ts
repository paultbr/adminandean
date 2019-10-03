import { Caracteristica } from './caracteristica';
import { CaracteristicaService } from './caracteristica.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Miga } from '../miga'
import { NgForm } from '@angular/forms';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styleUrls: ['./caracteristicas.component.css'],
  providers: [CaracteristicaService]
})
export class CaracteristicasComponent implements OnInit {
 
  public accionBoton: string = 'GUARDAR';
  public migas = [ new Miga('Características','/caracteristicas')];
  @ViewChild(MatPaginator) paginador: MatPaginator;
  @ViewChild(MatSort) ordenar: MatSort;
  caracteristicasCol: string[] = ['nombre', 'medida', 'edit', 'delete'];
  datos              : MatTableDataSource<Caracteristica>;
  step : number = 1;

  constructor(public caracteristicaService: CaracteristicaService, public snackBar: MatSnackBar, public dialog : MatDialog) {}

  ngOnInit() {
    this.accionBoton = 'Guardar';   
    this.caracteristicaService.getCaracteristicas().subscribe(res =>{
      this.caracteristicaService.caracteristicas = res as Caracteristica[];
      this.datos = new MatTableDataSource(this.caracteristicaService.caracteristicas);
      this.datos.paginator = this.paginador;
      this.datos.sort = this.ordenar;
    });
  }

  /**
   * Métodod que elimina la característica seleccionada
   */
  deleteCaracteristica(){
    this.caracteristicaService.deleteCaracteristica(this.caracteristicaService.caracteristicaSelected).subscribe(res=> {
      const respuesta = res as Respuesta;
      if(respuesta.status) {
        this.openSnackBar(respuesta.status, respuesta.msg);
        this.caracteristicaService.caracteristicas.splice(this.caracteristicaService.caracteristicas.indexOf(this.caracteristicaService.caracteristicaSelected),1);
        this.caracteristicaService.caracteristicaSelected = new Caracteristica();
        this.datos.data = this.caracteristicaService.caracteristicas;
      }else {
        this.openSnackBar(respuesta.status, respuesta.error);
      }
    })
  }

  /**
   * Método para modificar los datos de una características
   * @param caracteristica : datos de la característica
   */
  editarCaracteristica(caracteristica: Caracteristica){
    this.caracteristicaService.caracteristicaSelected = caracteristica;
    this.step = 0;
  }

  /**
   * Método para obtener todas las características
   */
  getCaracteristicas(){
    this.caracteristicaService.getCaracteristicas().subscribe(res =>{
      this.caracteristicaService.caracteristicas = res as Caracteristica[];
      this.datos.data = this.caracteristicaService.caracteristicas;
    })
  }

  /**
   * Método para limpiar el formulario y poder ingresar una nueva característica
   */
  nuevaCaracteristica(){
    this.caracteristicaService.caracteristicaSelected = new Caracteristica();
    this.step = 0;
  }

  /**
   * Método para limpiar el formulario
   * @param form : datos del formulario
   */
  resetForm(form?: NgForm){
    if(form) {
      form.reset();
      this.caracteristicaService.caracteristicaSelected = new Caracteristica();
    }
  }

  /**
   * Método para guardar los datos de una características
   * @param form : datos de la característica
   */
  saveCaracteristica(form?: NgForm){
    if(form.value._id) {
      this.caracteristicaService.putCaracteristica(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if(respuesta.status) {
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.resetForm(form);
        }else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      })
    }else {
      this.caracteristicaService.postCaracteristica(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if(respuesta.status){
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.resetForm(form);
          this.getCaracteristicas();
        }else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      })
    }
  }

  /**
   * Método que selecciona una característica
   * @param caracteristica : datos de la característica
   */
  selectCaracteristica(caracteristica: Caracteristica){
    this.caracteristicaService.caracteristicaSelected = caracteristica;
    this.openDialog();
  }

  /**
   * Método para actualizar los datos de una característica
   * @param caracteristica : datos de la característica seleccionada
   */
  updateCaracteristica(caracteristica: Caracteristica){
    this.caracteristicaService.putCaracteristica(caracteristica).subscribe(res =>{
      const respuesta = res as Respuesta;
      if (respuesta.status){
        this.openSnackBar(respuesta.status, respuesta.msg);
        this.getCaracteristicas();
      }else {
        this.openSnackBar(respuesta.status, respuesta.error);
      }
    })
  }

  /**
   * Método para abrir un bar que muestra un mensaje de confirmación
   * @param status : para definir el color del mensaje
   * @param mensaje : mensaje a mostrar
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }

  /**
   * Método que abre un diálogo de confirmación de eliminación
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        titulo: 'Mensaje de Confirmación',
        mensaje: '¿Esta seguro de que desea eliminar esta característica?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteCaracteristica();
      }
    });
  }

  /**
   * Método que cambia el panel de expansión
   * @param step : número del panel de expansión
   */
  setStep(step : number){
    this.step = step;
  }
  
}
