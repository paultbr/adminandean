import { Component, OnInit, Inject, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Constantes } from 'src/app/constantes';
import { ArticuloService } from '../../articulo/articulo.service';
import { ArchivosComponent } from 'src/app/archivos/archivos.component';
@Component({
  selector: 'app-dialogo-banner',
  templateUrl: './dialogo-banner.component.html',
  styleUrls: ['./dialogo-banner.component.css']
})
export class DialogoBannerComponent implements OnInit {

  URL_IMAGES = Constantes.URL_IMAGENES;
  listaArticulos: any[] = new Array();
  listaArticulosBanner: any[] = new Array();
  displayedColumns2: string[] = [];
  dataSource2: MatTableDataSource<any>;
  dataSource: MatTableDataSource<any>;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  mostrarCargandoDatos = true;
  constructor(
    public dialogRef: MatDialogRef<DialogoBannerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,public articuloService: ArticuloService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.displayedColumns2 = ["Imagen","Descripcion","Agregar"];
    this.obtenerArticulos();
    this.listaArticulosBanner = this.data.articulos;
    this.dataSource = new MatTableDataSource(this.listaArticulosBanner);
    this.dataSource.paginator = this.paginator.toArray()[1];
    this.dataSource.sort = this.sort.toArray()[1];

    console.log(this.listaArticulosBanner);
  }

  obtenerArticulos(){
    this.mostrarCargandoDatos = true;
    this.listaArticulos = new Array();
    this.dataSource2 = new MatTableDataSource(this.listaArticulos);
    this.articuloService.getArticulos().subscribe( res => {
      this.listaArticulos = res as any[];
      console.log(this.listaArticulos);
      this.dataSource2 = new MatTableDataSource(this.listaArticulos);
      this.dataSource2.paginator = this.paginator.toArray()[0];
      this.dataSource2.sort = this.sort.toArray()[0];
      this.mostrarCargandoDatos = false;
      // Obtener los cartéles vigentes
      
    });
  }
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  eliminarArticuloBanner(articulo){
    for(var i = 0;i<this.listaArticulosBanner.length;i++){
      if(this.listaArticulosBanner[i].idarticulo == articulo.idarticulo){
        this.listaArticulosBanner.splice(i,1);
        this.dataSource = new MatTableDataSource(this.listaArticulosBanner);
        this.dataSource.paginator = this.paginator.toArray()[1];
        this.dataSource.sort = this.sort.toArray()[1];
        this.data.articulos = this.listaArticulosBanner;
        break;
      }
    }
    

  }
  agregarArticulo(articulo){
    var existe = false;
    for(var i = 0;i<this.listaArticulosBanner.length;i++){

      if(this.listaArticulosBanner[i].idarticulo == articulo.idarticulo){
        existe = true;
        break;
      }
    }
    if(!existe){
      this.listaArticulosBanner.push(articulo);
      this.data.articulos = this.listaArticulosBanner;
      this.dataSource = new MatTableDataSource(this.listaArticulosBanner);
      this.dataSource.paginator = this.paginator.toArray()[1];
      this.dataSource.sort = this.sort.toArray()[1];
    }   
    

  }
  abrirDialogoArchivos(){
    var datos = {option: "simple"}
    const dialogRef = this.dialog.open(ArchivosComponent, {
      width: '70%',
      data: datos ,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //guaradar datos
        this.data.imagen = result.imagen;
      }else{
        console.log("CANCELO");
      }
    });
  }

}
