import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Miga } from '../miga';
import { NgForm } from '@angular/forms';
import { Provincia } from './provincia';
import { Region } from './region';
import { RegionService } from './region.service';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
  providers: [RegionService]
})
export class RegionComponent implements OnInit {

  departamentos : Region[];
  depSelected : Region;
  provincias : Provincia[];
  provSelected : Provincia;
  distritos : string[];
  lblDepartamento : string;
  lblProvincia : string;
  migas = [new Miga('Lugares de Envío', '/region')];

  constructor(public regionService : RegionService, public snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() { 
    this.provSelected = new Provincia(undefined,'',[]);
    this.depSelected = new Region(null,'',[this.provSelected]);
    this.provincias = [];
    this.lblDepartamento = 'Nuevo Departamento';
    this.lblProvincia = 'Nueva Provincia';
    this.getRegiones();
    document.getElementById('divProvincia').hidden = true;
    document.getElementById('divDistrito').hidden = true;
    document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('spanDepartamento').hidden = true;
    document.getElementById('spanProvincia').hidden = true;
    document.getElementById('spanDistrito').hidden = true;
  }

  /**
   * Método para seleccionar un departamento
   * @param departamento : nombre del departamento
   */
  dep_selected(departamento : string){
    var i : number = 0;
    while(this.regionService.regiones[i].departamento != departamento){
      i = i + 1;
    }
    this.depSelected = this.regionService.regiones[i];
    document.getElementById('divProvincia').hidden = false;
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    this.lblDepartamento = 'Editar Departamento'
    document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-edit"></i>';
    document.getElementById('btnDepartamento').style.backgroundColor = 'orange';
    document.getElementById('spanDepartamento').hidden = false;
    this.provSelected = new Provincia(undefined,"",[]);
    this.regionService.provinciaSelected = this.provSelected;
    document.getElementById('divDistrito').hidden = true;
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('btnProvincia').style.backgroundColor = '#63c2de';
    document.getElementById('spanProvincia').hidden = true;
    this.lblProvincia = 'Nueva Provincia';
  }

  /**
   * Método que selecciona un distrito
   * @param distrito : nombre del distrito
   */
  distSelected(distrito : string){
    document.getElementById('spanDistrito').hidden = false;
  }

  /**
   * Método para eliminar el departamento seleccionado, sus provincias y distritos
   */
  eliminarDepartamento(){
    this.regionService.deleteRegion(this.depSelected._id).subscribe(res =>{
      const respuesta = res as Respuesta;
        if(respuesta.status){
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.getRegiones();
          this.lblDepartamento = 'Nuevo Departamento';
          document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-plus"></i>';
          document.getElementById('btnDepartamento').style.backgroundColor = '#63c2de';
          document.getElementById('spanDepartamento').hidden = true;
          this.depSelected = new Region(null,'',[this.provSelected]);
        }else{
          this.openSnackBar(respuesta.status, respuesta.error);
        }
    });
  }

  /**
   * Método para eliminar un distrito de la provincia seleccionada
   * @param distrito : nombre del distrito
   */
  eliminarDistrito(distrito: string){
    var i : number = 0;
    while(this.provSelected.distritos[i] != distrito ){
      i = i + 1;
    }
    this.provSelected.distritos.splice(i,1);
    this.updateRegion(this.depSelected);
    this.regionService.distritoSelected = '';
  }

  /**
   * Método para eliminar la provincia seleccionada y sus distritos
   * @param provincia : nombre de la provincia
   */
  eliminarProvincia(provincia : string){
    var i : number = 0;
    while(this.depSelected.provincias[i].provincia != provincia){
      i = i + 1;
    }
    this.depSelected.provincias.splice(i,1);
    this.updateRegion(this.depSelected);
    this.regionService.provinciaSelected = new Provincia(undefined,'',[]);
  }

  /**
   * Método para obtener todas las regiones o departamentos
   */
  getRegiones() {
    this.regionService.getRegiones().subscribe(res => {
      this.regionService.regiones = res as Region[];
    })
  }

  /**
   * Método para crear una nueva provincia en el departamento seleccionado
   * @param form 
   */
  nuevaProvincia(form?: NgForm){
    if(!form.value._id) {
      this.depSelected.provincias.push(form.value);
    } 
    this.updateRegion(this.depSelected);
    form.reset();
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-plus"></i>';
    document.getElementById('btnProvincia').style.backgroundColor = '#63c2de';
    document.getElementById('spanProvincia').hidden = true;
    this.lblProvincia = 'Nueva Provincia';
  }

  /**
   * Método para guardar los datos de un nuevo departamento o actualizar un departamento seleccionado
   * @param form : datos del departamento
   */
  nuevoDepartamento(form?: NgForm) {
    if(form.value._id) {
      this.regionService.putRegion(form.value).subscribe(res =>{
        const respuesta = res as Respuesta;
        if(respuesta.status){
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.getRegiones();
          this.lblDepartamento = 'Nuevo Departamento';
          document.getElementById('btnDepartamento').innerHTML = '<i class="fa fa-plus"></i>';
          document.getElementById('btnDepartamento').style.backgroundColor = '#63c2de';
          document.getElementById('spanDepartamento').hidden = true;
          form.reset();
        }else{
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      })
    }else {
      this.regionService.postRegion(form.value).subscribe(res =>{
        const respuesta = res as Respuesta;
        if(respuesta.status){
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.getRegiones();
          form.reset();
        }else{
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      });
    }  
  }

  /**
   * Método para agregar un distrito a la provincia seleccionada
   * @param form : datos del nuevo distrito
   */
  nuevoDistrito(form? :NgForm){
    this.provSelected.distritos.push(form.value.distrito);
    this.updateRegion(this.depSelected);
    form.reset();
  }

  /**
   * Método que selecciona una provincia como provincia seleccionada
   * @param provincia : nombre de la provincia
   */
  prov_selected(provincia : string){ 
    var i : number = 0;
    while(this.depSelected.provincias[i].provincia != provincia){
      i = i + 1;
    }
    this.provSelected = this.depSelected.provincias[i] as Provincia;
    this.provSelected.distritos = this.provSelected.distritos ? this.provSelected.distritos : [];
    this.regionService.provinciaSelected = this.provSelected;
    document.getElementById('divDistrito').hidden = false;
    document.getElementById('btnProvincia').innerHTML = '<i class="fa fa-edit"></i>';
    document.getElementById('btnProvincia').style.backgroundColor = 'orange';
    document.getElementById('spanProvincia').hidden = false;
    this.lblProvincia = 'Editar Provincia';
  }

  /**
   * Método que limpia el formulario de la región
   * @param form 
   */
  resetForm(form?: NgForm) {
    if(form) {
      this.regionService.departamentoSelected = new Region();
      form.reset();
    }
  }

  /**
   * Método para actualizar los datos de una región
   * @param region : datos de la región
   */
  updateRegion(region : Region){
    this.regionService.putRegion(region).subscribe(res =>{
      const respuesta = res as Respuesta;
      if(respuesta.status){
        this.openSnackBar(respuesta.status, respuesta.msg);
      }else{
        this.openSnackBar(respuesta.status, respuesta.error);
      }
    });
  }

  /**
   * Método para abrir un bar que muestra un mensaje de confirmación
   * @param status : para definir el color del mensaje
   * @param mensaje : mensaje a mostrar
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
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
        mensaje: '¿Esta seguro de que desea eliminar este departamento y sus provincias?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.eliminarDepartamento();
      }
    });
  }
}
