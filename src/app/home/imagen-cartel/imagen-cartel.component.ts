import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Constantes } from '../../constantes';
import { ArticuloService } from 'src/app/articulo/articulo.service';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';

@Component({
  selector: 'app-imagen-cartel',
  templateUrl: './imagen-cartel.component.html',
  styleUrls: ['./imagen-cartel.component.css']
})
export class ImagenCartelComponent implements OnInit {

  selectedFile : File = null;
  listaImagenes : string[] = []; 
  urlImagen = Constantes.URL_IMAGENES

  constructor(public http: HttpClient,public dialogRef: MatDialogRef<ImagenCartelComponent>, public articuloService: ArticuloService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getListaImagenes();
  }

  cerrar(){
    this.dialogRef.close();
  }

  subirImagen(evento: any){
    this.selectedFile  = <File> evento.target.files[0];
    const fd = new FormData();
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.http.post(Constantes.URL_API_IMAGEN + '/subir' ,fd,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          this.openSnackBar(true, 'Subiendo '+ Math.round(event.loaded/event.total*100)+ '%')
          if(Math.round(event.loaded/event.total*100) == 100){
            this.openSnackBar(true, 'Se subió la imagen al servidor, ahora se esta comprimiendo la imagen');
          }     
        }else{
          if(event.type === HttpEventType.Response){
            this.getListaImagenes(); 
          }
        }
      }
    );
  }

  getListaImagenes(){
    this.articuloService.getImagenes()
      .subscribe(res=>{
        this.listaImagenes = res as string[];
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
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }
}
