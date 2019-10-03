import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ArticuloService } from 'src/app/articulo/articulo.service';
import { Constantes } from '../../constantes';

@Component({
  selector: 'app-select-imagen',
  templateUrl: './select-imagen.component.html',
  styleUrls: ['./select-imagen.component.css']
})
export class SelectImagenComponent implements OnInit {

  listaImagenes : string[];
  urlImagen = Constantes.URL_IMAGENES;
  imagenSeleccionada : string;
  listaimagenesfiltro           : string[];


  constructor(public dialogRef: MatDialogRef<SelectImagenComponent>, public articuloService: ArticuloService) { }

  ngOnInit() {
    this.articuloService.getImagenes().subscribe( res => {
      this.listaImagenes = res as string[];
    })
  }

  seleccionarImagen(imagen: string){
    this.imagenSeleccionada = imagen;  
  }

  cerrar(){
    this.dialogRef.close();
  }

  /**
   * Método que busca las imágenes por nombre de imagen
   * @param event : evento de levantar la tecla presionada (keyup)
   */
  buscarImagenesFiltro(event) {
    var input = document.getElementById("input-busqueda-imagenes-articulo") as HTMLInputElement;
    this.listaimagenesfiltro = new Array();
    for (var i = 0; i < this.listaImagenes.length; i++) {
      var inputcheck = document.getElementById(this.listaImagenes[i] + "itemimg") as HTMLDivElement;
      if (this.listaImagenes[i].includes(input.value)) {
        inputcheck.hidden = false;
      } else {
        inputcheck.hidden = true;
      }
    }
  }

  /**
   * Método para buscar imágenes en el modal de editor
   */
  buscarImagenesFiltroEditor() {
    var input = document.getElementById("input-busqueda-imagenes-articulo-editor") as HTMLInputElement;
    this.listaimagenesfiltro = new Array();
    for (var i = 0; i < this.listaImagenes.length; i++) {
      var inputcheck = document.getElementById(this.listaImagenes[i] + "editor") as HTMLDivElement;
      if (this.listaImagenes[i].includes(input.value)) {
        inputcheck.hidden = false;
      } else {
        inputcheck.hidden = true;
      }
    }
  }

}
