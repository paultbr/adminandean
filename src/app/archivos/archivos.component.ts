import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ArchivosService } from './archivos.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Constantes } from '../constantes';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {

  listaArchivos : any[] = new Array();
  listaCarpetas : any[] = new Array();
  nohayArchivos = false;
  desactivarBoton = true;
  nombreruta = "";
  
  archivoSeleccionado = "";
  listaArchivosSeleccionados : any[] = new Array();
  listaArchivosData: any[] = new Array();

  mostrarCargandoDatos = true;
  mostrarnuevacarpeta = false;
  opcion = "simple";
  URL_IMAGES = Constantes.URL_IMAGENES;
  readonly URL_API = Constantes.URL_API_IMAGEN + '/subir';
  selectedFile            : File                  = null;

  nuevaCarpeta = "";
  @ViewChild('input_nueva_carpeta') inputNuecaCarpeta: ElementRef;
  constructor(public dialogRef: MatDialogRef<ArchivosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public http: HttpClient, 
              public archivosService: ArchivosService,public snackBar: MatSnackBar) { 
                
              }

  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.mostrarCargandoDatos = true;
    this.obtenerArchivos();
    this.opcion = this.data.option;
   // console.log("OPCION: "+this.opcion);
    
    
  }
  irInicio(){
    this.nombreruta = "";
    this.obtenerArchivos();
  }
  irAtras(){
    var arrayRuta = this.nombreruta.split("/");
    this.nombreruta = "";
    for( var i = 1;i<arrayRuta.length-1;i++){
      this.nombreruta = this.nombreruta+"/"+arrayRuta[i];
    }
    this.obtenerArchivos();
  }
  actualizar(){
    this.obtenerArchivos();
  }

  obtenerArchivos(){
    this.listaArchivosSeleccionados = new Array();
    this.listaArchivosData = new Array();
    this.desactivarBoton = true;
    this.archivoSeleccionado = "";
    this.nohayArchivos = false;
    var ruta = {nombre:this.nombreruta};
    this.listaArchivos = new Array();
    this.listaCarpetas = new Array();
    this.mostrarCargandoDatos = true;
    this.archivosService.getArchivos(ruta).subscribe(res=>{
      var lista = res as any[];
      for(var i = 0;i<lista.length;i++){
        if(!lista[i].includes('.webp')){
          this.listaCarpetas.push(lista[i]);
        }else{
          this.listaArchivos.push(lista[i]);
        }
        
      }
      if(lista.length == 0){
        this.nohayArchivos = true;
      }
      this.mostrarCargandoDatos = false;
      //console.log(this.listaArchivos);

    });
  }
  seleccionarArchivo(archivo){
    if(this.opcion == "multi"){
      if(this.listaArchivosSeleccionados.includes(archivo)){
        this.listaArchivosSeleccionados.splice(this.listaArchivosSeleccionados.indexOf(archivo),1);
        this.listaArchivosData.splice(this.listaArchivosData.indexOf(this.nombreruta+"/"+archivo),1);
        this.data.lista = this.listaArchivosData;
      }else{
        this.listaArchivosSeleccionados.push(archivo);
        this.listaArchivosData.push(this.nombreruta+"/"+archivo);
        this.data.lista = this.listaArchivosData;
      }
      
    }else{
      this.archivoSeleccionado = archivo;
      this.data.imagen = this.nombreruta+"/"+this.archivoSeleccionado;
    }
    this.desactivarBoton = false;
    
  }
  buscaNuevaImagen() {
    document.getElementById("imagen_input_image").click();
  }
  
  subirImagenServer(evento) {
    this.selectedFile = < File > evento.target.files[0];
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    fd.append('ruta',this.nombreruta);
    this.http.post(this.URL_API, fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        if (Math.round(event.loaded / event.total * 100) == 100) {
          console.log("TERMINO DE SUBIR LA IMAGEN");
        }
      } else {
        if (event.type === HttpEventType.Response) {
          console.log("TERMINO DE SUBIR Y PROCESAR LA IMAGEN");
          this.openSnackBar(true, "La imagén se subió al servidor con éxito");
          this.obtenerArchivos();
          console.log(event.body)
        }
      }
    });
  }
  openSnackBar(status: boolean, mensaje: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [status ? 'exito' : 'error'],
      data: mensaje
    });
  }
  crearCarpeta(){
    this.mostrarnuevacarpeta = true;
    setTimeout(()=>{this.inputNuecaCarpeta.nativeElement.focus();},0);    
  }
  eliminaArchivo(archivo){
    this.archivosService.eliminarArchivo(this.nombreruta+"/"+archivo).subscribe(res=>{
      var mensaje = res as any ;
      if(mensaje.estado == 1){
        this.openSnackBar(true, "El archivo "+archivo+" se elimino exitosamente");
        this.obtenerArchivos();
      }else{
        this.openSnackBar(false, "Ocurrio un error al eliminar el archivo");
      }
    });
    
  }
  eliminarCarpeta(carpeta){
    console.log(this.nombreruta+"/"+carpeta);
    this.archivosService.eliminarCarpeta(this.nombreruta+"/"+carpeta).subscribe(res=>{
      var mensaje = res as any ;
      if(mensaje.estado == 1){
        this.openSnackBar(true, "La carpeta "+carpeta+" se elimino exitosamente");
        this.obtenerArchivos();
      }else{
        this.openSnackBar(false, mensaje.mensaje);
      }
    });
    
  }
  procesarCreacionCarpeta(){
    console.log("CREANDO CARPETA: "+this.nuevaCarpeta);
    this.nuevaCarpeta = this.nuevaCarpeta.split(' ').join('_');
    
    this.archivosService.crearCarpeta(this.nombreruta,this.nuevaCarpeta).subscribe(res=>{
      var mensaje = res as any ;
      if(mensaje.estado == 1){
        this.openSnackBar(true, "La carpeta se creo exitosamente");
      }else{
        this.openSnackBar(false, "Ocurrio un error al crear la carpeta");
      }
      this.mostrarnuevacarpeta = false;
      this.nuevaCarpeta = "";
      this.obtenerArchivos();
      
    });
  }
  cancelarCreacionCarpeta(){
    this.mostrarnuevacarpeta = false;
    this.nuevaCarpeta = "";
  }
  abrirCarpeta(nombrecarpeta){
    this.nombreruta = this.nombreruta+ "/"+nombrecarpeta;
    this.obtenerArchivos();
  }


}
