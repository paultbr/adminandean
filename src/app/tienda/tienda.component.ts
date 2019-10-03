import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Miga } from '../miga';
import { NgForm } from '@angular/forms';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Tienda } from './tienda';
import { TiendaService } from './tienda.service';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  botonAccion     : string = "Agregar";
  mostrarTienda   : boolean;
  displayedColumns: string[] = ['nombre', 'latitud', 'longitud', 'edit'];
  dataSource              : MatTableDataSource<Tienda>;
  migas                    = [ new Miga('Tienda','locales')];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public tiendaService: TiendaService, public snackBar: MatSnackBar) {
    this.mostrarTienda = true;
   }

  ngOnInit() {
    this.tiendaService.getTiendas().subscribe( res => {
      const respuesta = res as Respuesta;
      this.tiendaService.tiendas = respuesta.data as Tienda[];
      this.dataSource = new MatTableDataSource(this.tiendaService.tiendas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Método para agregar la ubicación de una tienda en el mapa
   * @param form 
   */
  agregarTienda(form?: NgForm){
    if(this.tiendaService.tienda._id){
      this.tiendaService.putTienda(this.tiendaService.tienda).subscribe( res => {
        const respuesta = res as Respuesta;
        if(respuesta.status){
          this.mostrarTienda = this.mostrarTienda ? false : true;
          form.resetForm();
          this.openSnackBar(respuesta.status, respuesta.msg);
        } else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      });
    } else {
      this.tiendaService.postTienda(this.tiendaService.tienda).subscribe( res => {
        const respuesta = res as Respuesta;
        if(respuesta.status){
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.tiendaService.tienda = new Tienda();
          this.mostrarTienda = this.mostrarTienda ? false : true;
          form.resetForm();
          this.tiendaService.tiendas.push(respuesta.data as Tienda);
          this.dataSource.sort = this.sort;
        } else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      });
    }
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
   * Método que permite editar la ubicación de una tienda
   * @param tienda : datos de la tienda
   */
  editarTienda(tienda: Tienda){
    this.tiendaService.tienda = tienda;
    this.mostrarTienda = this.mostrarTienda ? false : true;
    this.botonAccion = 'MODIFICAR TIENDA';
  }

  /**
   * Método para agregar una nueva tienda
   * @param form : datos de la tienda
   */
  nuevaTienda(form?: NgForm){
    this.tiendaService.tienda = new Tienda();
    this.botonAccion = 'AGREGAR TIENDA';
    form.resetForm();
    this.mostrarTienda = this.mostrarTienda ? false : true;
  }

  /**
   * Método que muestra un Bar temporal para confirmar los mensajes de éxito y de error
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }

}
