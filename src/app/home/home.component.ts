import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ArticuloService } from '../articulo/articulo.service';
import { Articulo } from '../articulo/articulo';
import { Banner } from './banner';
import { Constantes } from '../constantes';
import { Miga } from '../miga';
import { Respuesta } from '../usuario/respuesta';
import { ImagenCartelComponent } from './imagen-cartel/imagen-cartel.component';
import { SelectImagenComponent } from './select-imagen/select-imagen.component';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { DialogoBannerComponent } from './dialogo-banner/dialogo-banner.component';
import { ArchivosComponent } from '../archivos/archivos.component';

export class Cartel {
  _id: string;
  idEquipo: string;
  urlImagen: string;
  tipo: string;
  activo: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public migas = [ new Miga('Imágenes del Menú Principal','/home')];
  accesoriosCartel  : Cartel[]  = [];
  articulosCartel   : Cartel[]  = [];
  banners           : any[]     = new Array();
  indexBannerSelected   = 0;
  imagenesSeleccionadas : string[]  = new Array();
  imagenSelected    : string;
  listaAccesorios   : Articulo[]  = [];
  listaArticulos    : Articulo[]  = [];
  listaCarteles     : Cartel[];
  listaequiposbanner: any[]   = new Array();
  listaequiposbannerfiltro: any[]   = new Array();
  listaimagenes     : string[];
  listaimagenesfiltro : string[];
  listaPreciosFiltro: any[]   = new Array();
  selectedFile      : File                  = null;
  URL_IMAGES = Constantes.URL_IMAGENES;

  constructor( public http: HttpClient, public dialog: MatDialog, public articuloService: ArticuloService, public snackBar: MatSnackBar) { }
  
  ngOnInit() {
    // Obtener todos los artículos con registro completo
    this.articuloService.getArticulos().subscribe( res => {
      this.articuloService.listaArticulos = res as Articulo[];
      // Obtener los cartéles vigentes
      this.articuloService.getCarteles().subscribe( res => {
        const rspta = res as Respuesta;
        if(rspta.status){
          this.openSnackBar(rspta.status, rspta.msg);
          this.articulosCartel = rspta.data as Cartel[];
          this.accesoriosCartel = rspta.data2 as Cartel[];
          this.preSeleccionarListas();
        } else {
          this.openSnackBar(rspta.status, rspta.error);
        }
      });
    });
    this.getListaBanners();
  }

  /**
   * Método que permite agregar un accesorio a la lista de accesorios
   */
  agregarAccesorio() {
    var verificar = this.accesoriosCartel.length != 0 ? this.verificarAccesorio() : true;
    if( verificar) {
      this.accesoriosCartel.push(new Cartel());
      this.openSnackBar(true, "Seleccione el accesorio y su respectiva imagen.");
    } else {
      this.openSnackBar(false, 'Por favor, complete la información del accesorio anterior.');
    }
  }

  /**
   * Método para agregar un artículo a la lista de artículos, verificando que los anteriores tengan la información completa.
   */
  agregarArticulo(){
    var verificar = this.articulosCartel.length != 0 ? this.verificarArticulo() : true;
    if( verificar) {
      this.articulosCartel.push(new Cartel());
      this.openSnackBar(true, "Seleccione el artículo y su respectiva imagen.");
    } else {
      this.openSnackBar(false, 'Por favor, complete la información del artículo anterior.');
    }
  }

  /**
   * Método que agrega artículos a un banner
   * @param arti 
   */
  agregararticuloBanner(arti){
    var existe = false;
    for(var i=0;i<this.banners[this.indexBannerSelected].articulos.length;i++){
      if(this.banners[this.indexBannerSelected].articulos[i].titulo == arti.titulo){
        this.banners[this.indexBannerSelected].articulos.splice(i,1);
        existe = true;     
      }
    }
    if(!existe){
      var articulo = {
        idarticulo: arti.idarticulo,
        url: arti.url,  
        titulo: arti.titulo,
        categoria:arti.categoria,
        idprecio:arti.idprecio,
        cantidad:arti.cantidad,
        imagenes: arti.imagenes,
        marca: arti.marca,
        descuento: arti.descuento
      }
      this.banners[this.indexBannerSelected].articulos.push(articulo);
    }
  }

  /**
   * Método que agrega un nuevo banner
   */
  agregarBanner(){
    this.banners.push(new Banner())
    this.abrirDialogoBanner(this.banners[this.banners.length-1],this.banners.length-1);
  }

  /**
   * Método para agregar imagenes a un artículo
   * @param nombre 
   */
  agregarImagenesArticulo(nombre: string){
    this.banners[this.indexBannerSelected].imagen = nombre;
  }

  /**
   * Método que filtra para buscar las imagenes
   * @param event : evento al presionar tecla
   */
  buscarImagenesFiltro(event){
    var input  = document.getElementById("input-busqueda-imagenes-articulo") as HTMLInputElement;
    this.listaimagenesfiltro = new Array();
    for(var i=0;i<this.listaimagenes.length;i++){
      var inputcheck = document.getElementById(this.listaimagenes[i]+"itemimg") as HTMLDivElement;
      if(this.listaimagenes[i].includes(input.value)){
        inputcheck.hidden = false;
      }else{
        inputcheck.hidden = true;
      }
    }  
  }

  /**
   * Método para agregar una nueva imagen
   */
  buscaNuevaImagen(){
    document.getElementById("imageninput").click();
  }

  /**
   * Método que permite eliminar un accesorio de la lista de accesorios
   * @param indice : índice del accesorio
   */
  eliminarAccesorio(indice: number) {
    if(this.accesoriosCartel[indice]._id){
      this.articuloService.eliminarCartel(this.accesoriosCartel[indice]._id).subscribe( res => {
        var rspta = res as Respuesta;
        rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error);
      });
    } else {
      this.openSnackBar(true, 'El accesorio se ha eliminado de la lista de accesorios.')
    }
    this.accesoriosCartel.splice(indice, 1);
  }

  /**
   * Método que dado el índice de un artículo permite eliminarlo de la lista de artículos
   * @param indice : índice en la lista del artículo
   */
  eliminarArticulo(indice: number){
    if(this.articulosCartel[indice]._id){
      this.articuloService.eliminarCartel(this.articulosCartel[indice]._id).subscribe( res => {
        var rspta = res as Respuesta;
        rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error);
      });
    }  else {
      this.openSnackBar(true, 'El artículo se eliminó de la lista de artículos');
    }
    this.articulosCartel.splice(indice, 1);
  }

  /**
   * Método que eliminar un item de un banner
   * @param i : indice del item
   */
  eliminarItemBanner(i){
    this.banners.splice(i,1);
  }

  /**
   * Método que elimina una imagen de un artículo
   * @param id 
   */
  eliminarItemImagen(id:string){
    this.listaimagenesfiltro = this.listaimagenes;
    for(var i=0;i<this.imagenesSeleccionadas.length;i++){
      if(this.imagenesSeleccionadas[i] == id){
        this.imagenesSeleccionadas.splice(i,1);
        var inputcheck = document.getElementById(id) as HTMLInputElement;
        inputcheck.checked = false;
      }else{
        var inputcheck = document.getElementById(id) as HTMLInputElement;
        inputcheck.checked = true;
      }
    }
  }
  
  /**
   * Método que obtiene la lista de banners
   */
  getListaBanners(){
    this.articuloService.getBanners().subscribe(res=>{
      this.banners = res as Banner[];
    });
  }

  /**
   * Método que obitene la lista de equipos
   * @param indice 
   */
  getListaEquipos(indice){
    this.indexBannerSelected = indice;
    this.banners[this.indexBannerSelected].articulos = new Array();
    this.articuloService.getArticulos().subscribe( res => { 
      this.listaequiposbanner = res as string[];
    });
  }

  /**
   * Método que obtiene imagenes de la base de datos
   * @param indice : índice del banner seleccionado
   */
  getListaImagenes(indice){
    this.indexBannerSelected = indice;
    this.articuloService.getImagenes().subscribe( res => {
      this.listaimagenes = res as string[];
      this.listaimagenesfiltro = this.listaimagenes;
    });
  }

  /**
   * Método que permite guardar la lista de accesorios
   */
  guardarAccesorios(){
    this.articuloService.postCarteles(this.accesoriosCartel).subscribe( res => {
      var rspta = res as Respuesta;
      rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error) ;
    });
  }

  /**
   * Método que permite almacenar en la base de datos la información de los artículos
   */
  guardarArticulos(){
    this.articuloService.postCarteles(this.articulosCartel).subscribe( res => {
      var rspta = res as Respuesta;
      rspta.status ? this.openSnackBar(rspta.status, rspta.msg) : this.openSnackBar(rspta.status, rspta.error) ;
    });
  }

  /**
   * Método que guarda los banners en la base de datos
   */
  guardarBanners(){
    this.articuloService.postBanners(this.banners).subscribe(res=>{
      var rspta = res as Respuesta;
      if(rspta.status){
        this.openSnackBar(rspta.status, rspta.msg);
      } else {
        this.openSnackBar(rspta.status, rspta.error);
      }
    })
  }

  /**
   * Método que muestra un bar temporal para confirmar un mensaje
   * @param status : tipo de mensaje a mostrar
   * @param mensaje : contenido del mensaje a mostrar
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
   * Método que pre selecciona los equipos guardados anteriormente en los artículos y los accesorios
   */
  preSeleccionarListas() {
    for(var i = 0; i < this.articulosCartel.length; i++){
      var j = 0;
      while((j < this.articuloService.listaArticulos.length) && (this.articuloService.listaArticulos[j]._id != this.articulosCartel[i].idEquipo)){
        j++;
      }
      this.listaArticulos.push(this.articuloService.listaArticulos[j]);
    }
    for(var i = 0; i < this.accesoriosCartel.length; i++){
      var j = 0;
      while((j < this.articuloService.listaArticulos.length) && (this.articuloService.listaArticulos[j]._id != this.accesoriosCartel[i].idEquipo)){
        j++;
      }
      this.listaAccesorios.push(this.articuloService.listaArticulos[j]);
    }
  }

  /**
   * Método que permite completar el equipo de un accesorio
   * @param accesorio : objeto del accesorio
   * @param idEquipo : identificador del equipo de tipo accesorio
   */
  seleccionarAccesorio(accesorio: Cartel, idEquipo: string){
    accesorio.idEquipo = idEquipo;
    accesorio.activo = true;
    accesorio.tipo = "ACCESORIO";
  }

  /**
   * Método que seleccionar un artículo y completa su información como tipo y lo activa.
   * @param cartel : objeto donde se guarda la información del artículo
   * @param idEquipo : identificador del equipo
   */
  seleccionarArticulo(cartel: Cartel, idEquipo: string){
    cartel.idEquipo = idEquipo;
    cartel.activo = true;
    cartel.tipo = 'ARTICULO';
  }

  /**
   * Método que abre un dialogo para seleccionar una imagen de un artículo o accesorio
   * @param cartel : objeto de tipo cartel
   */
  seleccionarImagen(cartel: Cartel){
    var datos = {option: "simple"}
    const dialogRef = this.dialog.open(ArchivosComponent, {
      width: '70%',
      data: datos ,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        cartel.urlImagen = result.imagen;
      }else{
        console.log("CANCELO");
      }
    });
    /*const dialogRef = this.dialog.open(SelectImagenComponent, {
      width: '800px',
      panelClass: 'dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      cartel.urlImagen = result;
    });*/
  }

  /**
   * 
   */
  subirImagen(){
    this.dialog.open(ImagenCartelComponent, {
      width: '600px',
      panelClass: 'dialog'
    });
  }

  /**
   * 
   * @param evento 
   */
  subirImagen2(evento){
    this.selectedFile  = <File> evento.target.files[0];
    let headers = new Headers();
    headers.append('Content-Type','multipart/form-data');
    headers.append('nombre','nuevonombre.webp');
    const fd = new FormData();
    fd.append('image',this.selectedFile, this.selectedFile.name);
    this.http.post(Constantes.URL_API_IMAGEN + '/subir',fd,{      
      reportProgress: true,
      observe: 'events'
    }).subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          if(Math.round(event.loaded/event.total*100) == 100){
            this.openSnackBar(true, 'La imagen se subió con éxito')
          }     
        }else{
          if(event.type === HttpEventType.Response){
            this.getListaImagenes(0); 
          }
        }
      }
    );
  }

  /**
   * Método que verifica si el último artículo agregado tiene la información completa.
   */
  verificarArticulo(): boolean{
    var indice = this.articulosCartel.length - 1;
    if(this.articulosCartel[indice].idEquipo == null && this.articulosCartel[indice].urlImagen == null){
      return false;
    } else {
      return true;
    }
  }

  /**
   * Método que verifica si un accesorio tiene la información completa
   */
  verificarAccesorio(): boolean{
    var indice = this.accesoriosCartel.length - 1;
    if(this.accesoriosCartel[indice].idEquipo == null && this.accesoriosCartel[indice].urlImagen == null){
      return false;
    } else {
      return true;
    }
  }


  // BANNERS
  abrirDialogoBanner(banner, index){
    var oldbanner = {
      imagen: banner.imagen,
      articulos: banner.articulos
    };
    const dialogRef = this.dialog.open(DialogoBannerComponent, {
      width: '70%',
      data: oldbanner,
      disableClose: true
    });
    console.log("IMAGEN");
    console.log(banner.imagen);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //guaradar datos
        console.log(result);
        this.banners[index] = result;
      }else{
        console.log("CANCELO");
        if(banner.imagen == "" && banner.articulos.length == 0){
          this.banners.splice(index,1);
        }
        
      }
    });
  }
}
