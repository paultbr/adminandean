import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog} from '@angular/material';
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';
import { Categoria } from '../categoria/categoria';
import { Caracteristica }  from '../caracteristicas/caracteristica';
import { CaracteristicaItem } from './caracteristica';
import { Constantes } from '../constantes';
import { Equipo } from './equipo';
import { Marca } from './marca';
import { Miga } from '../miga';
import { Precios} from '../planes/precios';
import { ArticuloService} from './articulo.service';
import { CaracteristicaService } from '../caracteristicas/caracteristica.service';
import { CategoriaService } from '../categoria/categoria.service';
import { MarcaService} from '../marcadistri/marca.service';
import { PlanesService} from '../planes/planes.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { PreciosService} from '../precios/precios.service';
import { ArchivosComponent } from '../archivos/archivos.component';

export interface articuloData {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: Number;
  estado: string;
}

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css'],
  providers: [ArticuloService]
})

export class ArticuloComponent implements OnInit {

  flag                    : boolean               = true;
  itemsDatosGenerales     : [number, string][]    = new Array();
  contador_datos_generales                        = 1;
  itemsCaracteristicas    : Number[]              = new Array();
  contador_caracteristicas                        = 1;
  itemsImagenes           : string[]              = new Array();
  contador_imagenes                               = 1;
  itemseleccionado        : string                = "";
  readonly URL_API                                = Constantes.URL_API_IMAGEN + '/subir';
  readonly URL_IMAGES                             = Constantes.URL_IMAGENES;
  selectedFile            : File                  = null;
  vista                   : string                = "1";
  //CATEGORIAS
  listacategorias         : Categoria[];
  listamarcas             : Marca[];
  //CARACTERISRTICAS
  listacaracteristicas    : Caracteristica[];
  listacaracteristicasarticulo : CaracteristicaItem[];
  //lista imagenes
  listaimagenes           : string[];
  //contenido del editor
  contenidoEditor         : string = "<p></p>";
  contenidoEditorCaracteristicas         : string = "<p></p>";
  contenidoEditorGarantias : string="<p></p>";
  // lista de imagenes seleccionadas
  imagenesSeleccionadas   : string[] = new Array();
   // nombre imagen para el editor
  imageneditorseleccionada: string="";
  migas                   : Miga[] = [new Miga('Artículos','articulos')];
  editorInstance          : any;
  // Property Binding
  mostrarFormularioArticulo   : boolean = false;
  mostrarBotonOpcion          : boolean = false;
  mostrarListaArticulos       : boolean = false;
  mostrarCarga                : boolean = false;
  //Lista de precios
  listaprecios                : Precios[] = new Array();
  listaequipos                = new Array();
  listaplanesequipo           = new Array();
  mostrarImagen           : boolean = false;
  mostrarListaImgenesEquipo : boolean = false;
  planesseleccionada = {
    tipoplan:"",
    planes: new Array()
  };

  quillConfig={
    toolbar: {
      container: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],        
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction        
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],        
            ['clean'],                                         // remove formatting button        
            ['link', 'image', 'video']                         // link and image, video
         ],
         handlers: {'image': this.buscaNuevaImagenEditor}
       }
  };
  quillConfig2={
    toolbar: {
      container: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],        
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction        
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],        
            ['clean']
         ],
         handlers: {'image': this.buscaNuevaImagenEditor}
       }
  };

  // DATA TABLE ANGULAR MATERIAL  
  displayedColumns: string[] = ['idArticulo', 'Descripcion', 'Cantidad', 'Categoria', 'Estado','editar'];
  dataSource: MatTableDataSource<ArticuloMysql>;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  displayedColumnsEquipos: string[] = ['Imagen','idArticulo', 'Descripcion', 'Cantidad','Detalle','Editar'];
  dataSourceEquipos: MatTableDataSource<Equipo>;
  indiceEquipo = 0;
  nombreColor = "";
  codigoColor = "";
  detallesEquipo = "";
  imagenEquipo="";
  descripcionEquipoSeleccionado="";
  palabraImagenesbuscar="";
  listaimagenesfiltro           : string[];
  agregarEn = "equipo"; // o editor
  planSeleccionado = {
    precio:0
  };
  descuento: any = 0;
  preciocondescuento: any = 0;

  constructor(public http: HttpClient, 
              public articuloService: ArticuloService,
              public categoriaService: CategoriaService,
              public caracteristicaService: CaracteristicaService,
              public marcaService: MarcaService,
              public planesService: PlanesService,
              public precioService: PreciosService, 
              public snackBar: MatSnackBar,public dialog: MatDialog) { 
                this.dataSource = new MatTableDataSource(this.articuloService.articulosMysql);
              }

  ngOnInit() {
    this.itemsDatosGenerales.push([1, ""]);
    this.itemsCaracteristicas.push(1);
    this.itemsImagenes.push("imagen-1");
    this.listacaracteristicas = new Array();
    this.getArticulosMysql();
    this.getCategorias();
    this.getMarcas();
    this.obtenerListaPrecios();
    this.articuloService.articuloSeleccionado.equipos.push(new Equipo("", "", 0, "", "", ""));
    this.getListaImagenes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator.toArray()[0];
    this.dataSource.sort = this.sort.toArray()[0];
  }

  /**
   * Método que vuelve abrir el formulario de lista de equipos
   */
  abrirFormularioEquipo() {
    this.mostrarListaImgenesEquipo = false;
  }

  /**
   * Método para abrir el modal para seleccionar y subir imágenes
   */
  abrirImagenes() {
    this.agregarEn = "equipo";
    this.mostrarListaImgenesEquipo = true;
  }

  abrirDialgoImagenes(){
    var datos = {option: "multi"}
    const dialogRef = this.dialog.open(ArchivosComponent, {
      width: '70%',
      data: datos ,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        var arrayImagenes = result.lista;
        for(var i = 0;i< arrayImagenes.length;i++){
          this.agregarImagenesArticulo(arrayImagenes[i]);
        }
      }else{
        console.log("CANCELO");
      }
    });
  }

  abrirDialgoImagenesEditor(){
    var datos = {option: "simple"}
    const dialogRef = this.dialog.open(ArchivosComponent, {
      width: '70%',
      data: datos ,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        this.agregarImagenEditor(result.imagen);
      }else{
        console.log("CANCELO");
      }
    });
  }
  abrirDialogoImagenEquipo(){
    var datos = {option: "simple"}
    const dialogRef = this.dialog.open(ArchivosComponent, {
      width: '70%',
      data: datos ,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        this.agregarImagenEquipo(result.imagen);
      }else{
        console.log("CANCELO");
      }
    });
  }

  /**
   * Método para agregar una imagen en el editor
   */
  agregarImagenEditor(imagen) {
    const range = this.editorInstance.getSelection();
    this.editorInstance.insertEmbed(range.index, 'image', this.URL_IMAGES + "/lg" + imagen);
  }

  /**
   * Método que selecciona una imagen y la agrega a la lista de imágenes de un artículo
   */
  agregarImagenEquipo(imagenSeleccionada) {
    var imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src = this.URL_IMAGES + "/md/" + imagenSeleccionada;
    this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen = imagenSeleccionada;
    
  }

  /**
   * Método que agrega una imagen a un artículo
   * @param nombre : nombre de la imagen
   */
  agregarImagenesArticulo(nombre: string) {
    var existe = false;
    for (var i = 0; i < this.imagenesSeleccionadas.length; i++) {
      if (this.imagenesSeleccionadas[i] == nombre) {
        //this.imagenesSeleccionadas.splice(i, 1);
        existe = true;
      }
    }
    if (!existe) {
      this.imagenesSeleccionadas.push(nombre);
    }
  }

  /**
   * Método que aplica un filtro para buscar en la tabla de ARTÍCULOS
   * @param filterValue : valor a filtrar
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Método que aplica un filtro para buscar en la tabla de EQUIPOS
   * @param filterValue : valor a filtrar
   */
  applyFilterEquipo(filterValue: string) {
    this.dataSourceEquipos.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceEquipos.paginator) {
      this.dataSourceEquipos.paginator.firstPage();
    }
  }

  /**
   * Método que abre un evento click para agregar una nueva imagen
   */
  buscaNuevaImagen() {
  }

  /**
   * Método para agregar una imagen en el editor de la descripción de un equipo
   */
  buscaNuevaImagenEditor() {
    console.log("hola mundo");
    document.getElementById("btnDialogoImgEditor").click();
  }

  /**
   * Método que obtiene la lista de imágenes
   */
  buscarImagen() {
    this.getListaImagenes();
  }

  /**
   * Método que genera las palabras clave de un artículo para su busqueda
   */
  buscarPalabrasClaves() {
    var palabras = this.articuloService.articuloSeleccionado.titulo;
    for (var i = 0; i < this.listacategorias.length; i++) {
      if (this.articuloService.articuloSeleccionado.categoria == this.listacategorias[i]._id) {
        palabras += " " + this.listacategorias[i].nombre;
        break;
      }
    }
    for (var i = 0; i < this.listamarcas.length; i++) {
      if (this.articuloService.articuloSeleccionado.marca == this.listamarcas[i]._id) {
        palabras += " " + this.listamarcas[i].nombremarca;
        break;
      }
    }
    var datoscaracteristicas = document.getElementById("contenido-datos-caracteristicas");
    var caracteristicas = datoscaracteristicas.getElementsByClassName("item-caracteristicas");
    for (var i = 0; i < caracteristicas.length; i++) {
      var c = new CaracteristicaItem(caracteristicas[i].getElementsByTagName("input")[0].value, caracteristicas[i].getElementsByTagName("input")[1].value);
      palabras += " " + c.nombre + " " + c.valor;
    }
    for (var i = 0; i < this.articuloService.articuloSeleccionado.equipos.length; i++) {
      if (this.articuloService.articuloSeleccionado.equipos[i].cantidad > 0)
        palabras += " " + this.articuloService.articuloSeleccionado.equipos[i].detalle;
    }
    this.articuloService.articuloSeleccionado.palabrasclaves = palabras.toLowerCase();
  }

  /**
   * Método que obtiene los planes de cada equipo
   */
  /*buscarPlanesEquipo() {
    this.planesService.getPlanesEquipo(this.articuloService.articuloSeleccionado.idprecio).subscribe(res => {
      this.planSeleccionado = res[0];
    });
  }*/

  /**
   * Método que busca el precio que sea el más parecido al nombre del artículo
   */
  /*buscarPreciosEquipo() {
    var cont = 0;
    var cont_ante = 0;
    var mejor_nombre = "";
    var arraynombres = this.articuloService.articuloSeleccionadoMysql.Descripcion.split(" ");
    for (var i = 0; i < this.listaequipos.length; i++) {
      var nombre = this.listaequipos[i].nombreequipo;
      for (var j = 0; j < arraynombres.length; j++) {
        if (nombre.includes(arraynombres[j])) {
          cont++;
        }
      }
      if (cont > cont_ante) {
        mejor_nombre = nombre;
        cont_ante = cont;
        cont = 0;
      } else {
        cont = 0;
      }
    }
    this.articuloService.articuloSeleccionado.idprecio = mejor_nombre;
  }*/

  /**
   * Método que cambia la vista de lista a detalle de un artículo
   * @param articulo : artículo a mostrar detalle
   * @param form : formualario del artículo
   */
  cambiarvista(articulo ? : ArticuloMysql, form ? : NgForm) {
    if (this.vista == "1") {
      this.vista = "2";
      this.contenidoEditor = "";
      this.contenidoEditorCaracteristicas = "";
      this.contenidoEditorGarantias = "";
      this.mostrarListaArticulos = false;
      this.mostrarFormularioArticulo = true;
      this.mostrarBotonOpcion = true;
      this.limpiarFormulario();
      this.articuloService.articuloSeleccionado.idarticulo = articulo.idArticulo;
      this.articuloService.articuloSeleccionado.cantidad = articulo.Cantidad;
      this.articuloService.articuloSeleccionadoMysql = articulo;
      this.articuloService.articuloSeleccionado.titulo = articulo.Descripcion;
      this.articuloService.articuloSeleccionado.descuento = 0;
      //this.buscarPreciosEquipo();
      this.obtenerEquiposArticulo("NO");
      this.obtenerPrecioArticulo(this.articuloService.articuloSeleccionadoMysql.idArticulo);
      this.generarURL();
    } else {
      this.vista = "1";
      this.mostrarListaArticulos = true;
      this.mostrarFormularioArticulo = false;
      this.mostrarBotonOpcion = false;
      this.dataSource = new MatTableDataSource(this.articuloService.articulosMysql);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort.toArray()[0];
    }
  }

  /**
   * Evento que crea el editor de la descripción del artículo
   * @param editorInstance 
   */
  created(editorInstance: any) {
    this.editorInstance = editorInstance;
  }

  /**
   * Método que obtiene los datos de un artículo para poder editarlos y modificarlos
   */
  editarArticulo(art) {
    this.contenidoEditor = "";
    this.contenidoEditorCaracteristicas = "";
    this.contenidoEditorGarantias = "";
    this.itemsDatosGenerales = new Array();
    this.articuloService.articuloSeleccionadoMysql = art;
    this.articuloService.getArticulo(this.articuloService.articuloSeleccionadoMysql.idArticulo).subscribe(res => {
      this.articuloService.articuloSeleccionado = res[0] as Articulo;
      this.imagenesSeleccionadas = this.articuloService.articuloSeleccionado.imagenes;
      try {
        for (var i = 0; i < this.imagenesSeleccionadas.length; i++) {
          var inputcheck = document.getElementById(this.imagenesSeleccionadas[i]) as HTMLInputElement;
          inputcheck.checked = true;
        }
      } catch (e) {
        this.openSnackBar(false, e);
      }
      this.contenidoEditor = this.articuloService.articuloSeleccionado.descripcion;
      this.contenidoEditorCaracteristicas = this.articuloService.articuloSeleccionado.caracteristicas;
      this.contenidoEditorGarantias= this.articuloService.articuloSeleccionado.garantias;
      //this.listacaracteristicasarticulo = this.articuloService.articuloSeleccionado.caracteristicas;
      this.obtenerPrecioArticulo(this.articuloService.articuloSeleccionadoMysql.idArticulo);
      this.obtenerEquiposArticulo("NO");
      /*if (this.listacaracteristicasarticulo.length == 0) {
        this.getCaracteristicas();
      }*/
      //this.buscarPlanesEquipo();
      this.vista = "2";
      this.mostrarListaArticulos = false;
      this.mostrarFormularioArticulo = true;
      this.mostrarBotonOpcion = true;
      this.mostrarBotonOpcion = true;
    });
  }

  /**
   * Método para editar las características de un equipo de un artículo
   * @param i : indice del equipo en la lista de equipos del artículo
   */

   precioventa :  any = 0;
   preciosugerido: Number = 0;
   preciocompra: Number = 0;;
  editarEquipo(i) {
    this.indiceEquipo = i;
    this.imagenEquipo = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen;
    this.descripcionEquipoSeleccionado = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].descripcion;
    this.detallesEquipo = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].detalle;
    //this.precioventa = this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].precioventa;
    
    this.preciosugerido = 0;//this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].precioreferencial;
    
    var imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src = this.URL_IMAGES + "/md/" + this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen;
    this.mostrarImagen = true;
  }
  obtenerPrecioArticulo(idArticuloGlobal){
    this.precioventa = 0;
    this.descuento = 0;
    this.preciocondescuento = 0;
    this.precioService.obtenerPrecioArticulo(idArticuloGlobal).subscribe(res=>{
      var precio = res[0] as any;
      console.log("HOLA HOA HOLA HOLA HOLA");
      console.log(precio);
      
        this.precioventa = precio.precioventa;
        this.descuento = precio.descuento;
        this.preciocondescuento = this.precioventa - (this.precioventa*this.descuento/100);
      
    });
  }

  actualizarPreciosEquipos(){
    this.obtenerEquiposArticulo("UPDATE");
  }

  /**
   * Método para elegir imagen del artículo
   * @param nombre : nombre de la imagen
   */
  elegirImagen(nombre: string) {
    this.imageneditorseleccionada = nombre;
  }

  /**
   * Método para elegir la imagen de un equipo
   * @param img : nombre de la imagen
   */
  elegirImagenEquipo(img) {
    this.imagenEquipo = img;
  }

  /**
   * 
   * @param id 
   */
  eliminarItemImagen(id: string) {
    for (var i = 0; i < this.imagenesSeleccionadas.length; i++) {
      if (this.imagenesSeleccionadas[i] == id) {
        this.imagenesSeleccionadas.splice(i, 1);
        break;
      } 
    }
  }

  /**
   * Método que genera la url para el artículo tomando el nombre del artículo como referencia
   */
  generarURL() {
    var titulo = this.articuloService.articuloSeleccionado.titulo;
    for (var i = 0; i < titulo.length; i++) {
      titulo = titulo.replace(" ", "-");
    }
    this.articuloService.articuloSeleccionado.url = titulo.toLowerCase();
  }

  /**
   * Método que obtiene los artículos de la base de datos MySQL
   */
  getArticulosMysql() {
    this.mostrarCarga = true;
    this.mostrarListaArticulos = false;
    this.articuloService.getArticulosMysql().subscribe(res => {
      this.articuloService.articulosMysql = res as ArticuloMysql[];
      if (this.articuloService.articulosMysql.length > 0) {
        this.mostrarListaArticulos = true;
      }
      this.dataSource = new MatTableDataSource(this.articuloService.articulosMysql);
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort.toArray()[0];
      this.mostrarCarga = false;
    });
  }

  /**
   * Método que obtiene las características de una categoría para el artículo
   */
  /*getCaracteristicas() {
    this.listacaracteristicasarticulo = new Array();
    for (var i = 0; i < this.listacategorias.length; i++) {
      if (this.articuloService.articuloSeleccionado.categoria == this.listacategorias[i]._id) {
        this.listacaracteristicas = this.listacategorias[i].caracteristicas;
      }
    }
    for (var i = 0; i < this.listacaracteristicas.length; i++) {
      this.listacaracteristicasarticulo.push(new CaracteristicaItem(this.listacaracteristicas[i].nombre, ""));
    }
  }*/

  /**
   * Método que obtiene las categorias disponibles
   */
  getCategorias() {
    this.categoriaService.getCategoriasHijos().subscribe(res => {
      this.listacategorias = res as Categoria[];
    });
  }

  /**
   * Método que obtiene la lista de imagenes de los artículos
   */
  getListaImagenes() {
    this.articuloService.getImagenes().subscribe(res => {
      this.listaimagenes = res as string[];
      this.listaimagenesfiltro = this.listaimagenes;
    });
  }

  /**
   * Método que obtiene las marcas registradas
   */
  getMarcas() {
    this.marcaService.getMarcas().subscribe(res => {
      this.listamarcas = res as Marca[];
    });
  }

  /**
   * Método para guardar la información de un artículo
   */
  guardarDatos() {
        
    //Asignar imagenes
    this.articuloService.articuloSeleccionado.imagenes = this.imagenesSeleccionadas;
    this.articuloService.articuloSeleccionado.descripcion = this.contenidoEditor;
    this.articuloService.articuloSeleccionado.caracteristicas = this.contenidoEditorCaracteristicas;
    this.articuloService.articuloSeleccionado.garantias = this.contenidoEditorGarantias;
    //guardar datos
    if (this.articuloService.articuloSeleccionado._id) {
      this.articuloService.putArticulo(this.articuloService.articuloSeleccionado).subscribe(res => {
        var respuesta = JSON.parse(JSON.stringify(res));
        if (respuesta.estado == "0") {
          this.openSnackBar(false, respuesta.mensaje);
        } else {
          this.cambiarvista();
          this.getArticulosMysql();
          this.openSnackBar(true, respuesta.mensaje);
        }
      });
    } else {
      this.articuloService.postArticulo(this.articuloService.articuloSeleccionado).subscribe(res => {
        var respuesta = JSON.parse(JSON.stringify(res));
        if (respuesta.estado == "0") {
          this.openSnackBar(false, respuesta.mensaje);
        } else {
          this.cambiarvista();
          this.getArticulosMysql();
          this.openSnackBar(true, respuesta.mensaje);
        }
      });
    }
  }

  /**
   * Método para guardar los datos de un equipo
   */
  guardarDatosEquipo() {
    this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].detalle = this.detallesEquipo;
    //this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].precioventa = this.precioventa;
    this.imagenEquipo = ""
  }

  /**
   * Me
   */
  limpiarFormulario() {
    this.articuloService.articuloSeleccionado = new Articulo();
    this.imagenesSeleccionadas = new Array();
    this.listacaracteristicas = new Array();
    this.itemsDatosGenerales = new Array();
    this.contenidoEditor = "<p></p>";
   // this.listacaracteristicasarticulo = new Array();
  }

  /**
   * 
   */
  limpiarImagen() {
    this.mostrarImagen = false;
  }

  /**
   * 
   * @param tipoplan 
   */
  mostrarDetalleTipoPlan(tipoplan) {
    this.planesseleccionada = tipoplan;
  }

  /**
   * 
   */
  obtenerEquiposArticulo(opcion) {
    this.articuloService.articuloSeleccionado.equipos = new Array();
    this.articuloService.articuloSeleccionado.equipos.push(new Equipo("", "", 0, "", "", ""));
    this.articuloService.getEquiposArticulo(opcion).subscribe(res => {
      console.log(res);
      this.articuloService.articuloSeleccionado.equipos = res as Equipo[];
      this.dataSourceEquipos = new MatTableDataSource(res as Equipo[]);
      this.dataSourceEquipos.paginator = this.paginator.toArray()[1];
      this.dataSourceEquipos.sort = this.sort.toArray()[1];
    });
  }

  /**
   * 
   */
  obtenerListaPrecios() {
    this.planesService.getEquipos().subscribe(res => {
      this.listaequipos = res as any[];
    });
  }

  /**
   * 
   * @param event 
   */
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post(Constantes.URL_API_IMAGEN + '/subir', fd, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          if (Math.round(event.loaded / event.total * 100) == 100) {
            this.openSnackBar(true, "Se subió la imagen con éxito");
          }
        } else {
          if (event.type === HttpEventType.Response) {
            var res = JSON.parse(JSON.stringify(event.body));
            var imagen = document.getElementById("imagen-select") as HTMLImageElement;
            imagen.src = this.URL_IMAGES + "/md/" + res.imagen;
            this.articuloService.articuloSeleccionado.equipos[this.indiceEquipo].imagen = res.imagen;
            this.mostrarImagen = true;
            this.imagenEquipo = this.selectedFile.name + ".webp";
          }
        }
      });
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

  /**
   * 
   * @param evento 
   */
  subirImagen(evento) {
    this.selectedFile = < File > evento.target.files[0];
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('nombre', 'nuevonombre.webp');
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API, fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        if (Math.round(event.loaded / event.total * 100) == 100) {
          this.openSnackBar(true, "La imagén se subió al servidor con éxito");
        }
      } else {
        if (event.type === HttpEventType.Response) {
          this.getListaImagenes();
        }
      }
    });
  }

  /**
   * 
   * @param evento 
   */
  subirImagenEditor(evento) {
    this.selectedFile = < File > evento.target.files[0];
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API, fd, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        if (Math.round(event.loaded / event.total * 100) == 100) {
          this.openSnackBar(true, "La imagén se subió al servidor con éxito");
        }
      } else {
        if (event.type === HttpEventType.Response) {
          this.getListaImagenes();
        }
      }
    });
  }
}
