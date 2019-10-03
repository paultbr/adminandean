import { Constantes } from './../constantes';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar, MatDialog} from '@angular/material';
import { Subject } from 'rxjs';
import { MarcaMysql } from './marca-mysql';
import { MarcaService } from './marca.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Marca } from './marca';
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { Miga } from '../miga';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { ArchivosComponent } from '../archivos/archivos.component';

@Component({
  selector: 'app-marcadistri',
  templateUrl: './marcadistri.component.html',
  styleUrls: ['./marcadistri.component.css'],
  providers:[MarcaService]
})

export class MarcadistriComponent implements AfterViewInit,OnDestroy,OnInit {
 //datos temp
  selectedFile: File = null;
  todasMarcas: Marca[];
  idm:string='';
  nombrem:string='';
  //datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  flag: boolean = true;
  migas: Miga[] = [ new Miga('Marcas', 'marcadistri')];
  //fin
  constructor(public http: HttpClient,public marcaService:MarcaService, public snackBar: MatSnackBar,public dialog: MatDialog) {}

  ngOnInit() {
    var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
    //datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };
    this.listarmarcas();
    document.getElementById('marca-detalle').hidden=true;
  }

  /* data table*/
  ngAfterViewInit(): void {
    this.dtTriggers.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTriggers.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTriggers.next();
    });
  }
  /*fin datatable*/
  listarmarcas(){
    document.getElementById("carga").hidden = false;
    document.getElementById("listarmarcas").hidden=true;
    this.marcaService.listarmarcamysql().subscribe(res =>{
      this.marcaService.marcaMysql = res as MarcaMysql[];
      if(this.marcaService.marcaMysql.length == 0){
        this.openSnackBar(false, 'No se encontraron datos, inténtelo nuevamente');
      }else{
        this.openSnackBar(true, 'Los datos se obtuvieron con éxito.');
        document.getElementById("listarmarcas").hidden=false;
      }
      this.rerender();
      document.getElementById("carga").hidden = true;
    });
  }

  guardartemdatos(marcamysql:MarcaMysql){
    document.getElementById("titulomodal").innerHTML = "Completar Registro para la Marca : " + marcamysql.NombreMarca;
    this.idm=marcamysql.idMarcaProducto;
    this.nombrem=marcamysql.NombreMarca;
  }

  //imagen

  abrirDialogoImagen(){
    var datos = {option: "simple"}
    const dialogRef = this.dialog.open(ArchivosComponent, {
      width: '70%',
      data: datos ,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
        imagen.src = Constantes.URL_IMAGENES+"/md/"+result.imagen;
         
        this.marcaService.marcaselect.imagen= result.imagen; 
      }else{
        console.log("CANCELO");
      }
    });
  }


  limpiarform(form?: NgForm){    
    if(form){   
      this.marcaService.marcaselect=new Marca();   
      var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
      imagen.src ="//placehold.it/600x300?text=Ninguna Imagen Seleccionada";
      var progreso = document.getElementById("progreso") as HTMLDivElement;     
    }
  }

  clearProgress(){
    var progreso = document.getElementById("progreso") as HTMLDivElement;
    progreso.style.width="0%";
    progreso.style.backgroundColor = "orange";
    var inputfile = document.getElementById("nombrearchivo") as HTMLDivElement;
    inputfile.style.display = "block";
    progreso.innerHTML = "";
    var archivoinput = document.getElementById("archivo") as HTMLInputElement;
    archivoinput.click();
  }

  mostrarmensaje(mensaje: string, estado: string){
    if(estado == "0"){
      var labelmensaje =  document.getElementById("resultadoerror") as HTMLLabelElement;
      labelmensaje.innerHTML = mensaje;      
      document.getElementById("btnmensajeerror").click();
    }else{
      var labelmensaje =  document.getElementById("resultadoexito") as HTMLLabelElement;
      labelmensaje.innerHTML = mensaje;
      document.getElementById("btnmensajeexito").click();
    }
  }

  //fin imagen
  getCategorias(){
    this.marcaService.listarmarcamysql()
    .subscribe(res=>{
      this.todasMarcas = res as Marca[];     
    });
  }

  guardarmarca(){
   var btncerrarmodal = document.getElementById("btnCerrarModal");
    this.marcaService.postMarca(this.marcaService.marcaselect)
    .subscribe(res => {
      var respuesta = JSON.parse(JSON.stringify(res));
      this.openSnackBar(true, 'Todo esta correcto');
      //this.limpiarform(form);
      btncerrarmodal.click();
         // this.getCategorias();
          //this.mostrarmensaje(respuesta.mensaje, respuesta.estado);
    });
  }
  editarMarca(marca){
    document.getElementById('marca-detalle').hidden=false;
    document.getElementById('marcageneral').hidden=true;
    this.marcaService.getMarcaMongo(marca.idMarca).subscribe(res=>{
      this.marcaService.marcaselect = res as Marca;
      var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
            imagen.src =Constantes.URL_IMAGENES+"/md/"+this.marcaService.marcaselect.imagen;
    })
  }
  
  cambiarvista(marca){
    document.getElementById('marca-detalle').hidden=false;
    document.getElementById('marcageneral').hidden=true;
    this.marcaService.marcaselect.idMarca=marca.idMarcaProducto;
    this.marcaService.marcaselect.nombremarca=marca.NombreMarca;
  }

  regresar(){
    document.getElementById('marca-detalle').hidden=true;
    document.getElementById('marcageneral').hidden=false;
    this.marcaService.marcaselect = new Marca();
  }

   /**
   * Método que muestra un Bar temporal para confirmar los mensajes de éxito y de error
   * @param status : Determina si es un mensaje de confirmación o error
   * @param mensaje : mensaje a enviar
   */
  openSnackBar(status: boolean, mensaje: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [status ? 'exito' : 'error'],
      data: mensaje
    });
  }
}

