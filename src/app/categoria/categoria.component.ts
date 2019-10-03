import { Constantes } from '../constantes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { CaracteristicaService } from '../caracteristicas/caracteristica.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Categoria } from './categoria';
import { Caracteristica }  from '../caracteristicas/caracteristica';
import { Miga } from '../miga';
import { MatPaginator, MatSort, MatTableDataSource, MatTable, MatSnackBar, MatDialog} from '@angular/material';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { IconsMaterial } from '../material_icons';
import { ArchivosComponent } from '../archivos/archivos.component';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  providers: [CategoriaService]
})
export class CategoriaComponent implements OnInit {

  readonly URL_API        = Constantes.URL_API_IMAGEN + '/subir';
  readonly URL_IMAGES     = Constantes.URL + '/imagenes';
  selectedFile            : File = null;
  nextID                  : Number = 0 ;
  vista                   : string = "1";
  IDCategoriaSelecionada  : string = "root";
  breadcrumb_categorias   : Categoria[] = new Array();
  todasCategorias         : Categoria[];
  mostrarCarga            : boolean = false;
  migas                   : Miga[] = [];
  mostrarImagen           : boolean = false;

  lista_iconos = IconsMaterial.lista_icons;
  noMostrarIcons = true;

  // DATA TABLE ANGULAR MATERIAL  
  displayedColumns: string[] = ['irsubcategoria', 'nombre', 'descripcion', 'opciones'];
  dataSource: MatTableDataSource<Categoria>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  iconoSeleccionado = "";

  constructor( 
    public http: HttpClient, 
    public categoriaService: CategoriaService,
    public caracteristicasService: CaracteristicaService,
    public snackBar: MatSnackBar,public dialog: MatDialog
  ) { }

  ngOnInit() {
    var cat = new Categoria();
    cat.nombre = "Categorias";
    cat._id = "root";
    cat.padre="root";
    this.mostrarSubCategorias(cat);
    this.getCategorias();
    this.categoriaService.categoriaSeleccionada.padre  = "root";    
    this.migas.push(new Miga('Categorias', 'categorias'));
  }
  
  limpiarform(){        
      this.categoriaService.categoriaSeleccionada = new Categoria();   
      this.categoriaService.categoriaSeleccionada.padre  = this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]._id;
      this.mostrarImagen = false;
      this.limpiarImagen();
    
  }

  limpiarImagen(){
    this.categoriaService.categoriaSeleccionada.imagen = "sinImagen.jpg";
    this.mostrarImagen = false;
  }

  mostrarMaterialIcons(){
    this.noMostrarIcons = false;
  }

  asignarIcon(icon){
    this.iconoSeleccionado = icon;
    this.noMostrarIcons = true;
    this.categoriaService.categoriaSeleccionada.icono = icon;
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

  guardarCategoria(){
    var btncerrarmodal = document.getElementById("btnCerrarModal");
    if(this.categoriaService.categoriaSeleccionada._id){
      this.categoriaService.putCategoria(this.categoriaService.categoriaSeleccionada)
      .subscribe(res=>{
        this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
        var respuesta = JSON.parse(JSON.stringify(res));
        if(respuesta.estado == "0"){    
          this.openSnackBar(false, "Ocurrió un error estado 0");
        }else{
          this.limpiarform();
          btncerrarmodal.click();
          this.getCategorias();
          this.openSnackBar(true, 'Todo está correcto')
        }   
      }); 
    }else{
      this.categoriaService.postCategoria(this.categoriaService.categoriaSeleccionada)
      .subscribe(res=>{ 
        this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
        var respuesta = JSON.parse(JSON.stringify(res));
        if(respuesta.estado == "0"){   
          this.openSnackBar(false, "Ocurrio un error: estado 0");
        }else{
          this.limpiarform();
          btncerrarmodal.click();
          this.getCategorias();
          this.openSnackBar(true, 'Todo está correcto');
        }
      });
    }
  }
  
  editarCategoria(categoria: Categoria){  
    this.categoriaService.categoriaSeleccionada = categoria;
    
    var  imagen = document.getElementById("imagen-select") as HTMLImageElement;
    imagen.src =this.URL_IMAGES+"/md/"+this.categoriaService.categoriaSeleccionada.imagen;  
    this.mostrarImagen = true;
  }

  eliminarCategoria(idCategoria){
    this.categoriaService.deleteCategoria(idCategoria)
    .subscribe(res=>{
      this.irASubCategoria(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1]);
      var respuesta = JSON.parse(JSON.stringify(res));
      this.getCategorias();
      this.openSnackBar(respuesta.estado, respuesta.mensaje);
    });
  }

  getCategorias(){
    this.mostrarCarga = true;
    this.categoriaService.getCategorias()
    .subscribe(res=>{
      this.todasCategorias = res as Categoria[];  
      this.mostrarCarga = false;
     
    });
  }


  mostrarSubCategorias(categoria: Categoria){    
    this.breadcrumb_categorias.push(categoria);  
    this.categoriaService.getSubCategorias(categoria._id)
    .subscribe(res=>{
      this.categoriaService.categorias = res as Categoria[];
      if(this.categoriaService.categorias.length == 0){
         document.getElementById("mensaje").innerHTML = "NO SE ENCONTRARON DATOS.";
      }else{
        document.getElementById("mensaje").innerHTML = "";
      }    
      this.dataSource = new MatTableDataSource(this.categoriaService.categorias);   
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
    });    
  }
  irASubCategoria(categoria: Categoria){
    while(this.breadcrumb_categorias[this.breadcrumb_categorias.length-1].nombre != categoria.nombre){
      this.breadcrumb_categorias.pop();
    }
    this.breadcrumb_categorias.pop();   
    this.mostrarSubCategorias(categoria);
  }

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
        imagen.src =this.URL_IMAGES+"/md"+result.imagen;            
        this.categoriaService.categoriaSeleccionada.imagen = result.imagen;
      }else{
        console.log("CANCELO");
      }
    });
  }



  /// aplicar filtro en el data table de material
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Método que abre un bar que muestra un mensaje de confirmación
   * @param status 
   * @param mensaje 
   */
  openSnackBar(status: boolean, mensaje: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [status ? 'exito' : 'error'],
      data: mensaje
    });
  }
}
