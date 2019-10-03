import { Component, OnInit, ViewChildren, QueryList, Inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Miga } from '../miga';
import { Constantes } from '../constantes';
import { PreciosService }from './precios.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from '../dialogo/dialogo.component';
import { DialogoPrecioComponent } from './dialogo-precio/dialogo-precio.component';
import { DialogoResultadoComponent } from './dialogo-resultado/dialogo-resultado.component';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.css']
})
export class PreciosComponent implements OnInit {
  readonly URL_API = Constantes.URL_API_PLANES+"/subir";

  mensajeestado = "";
  selectedFile: File = null;
  migas = [new Miga('Precios','/precios')];
  progreso=0;
  modo = 'determinate';
  mostrarProceso = false;
  mostrarOpciones = false;
  mostrarFormulario = false;
  nombreArchivoSeleccionado = "";
  disabledbtnFile= false;
  mostrarListaPrecios = false;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  displayedColumns2: string[] = [];
  dataSource2: MatTableDataSource<any>;

  listaprecios: any[] = new Array();
  listapreciosactual : any[] = new Array();

  precioSeleccionado: any;
  fechavigenciaPrecios:any = new Date();
  mostrarCargandoNuevaListaPrecios = false;
  mostrarCargandoDatos = true;

  sinPrecios = false;
  constructor(private http: HttpClient,public preciosService: PreciosService,public dialog: MatDialog) { }

  ngOnInit() {
    /*var progreso = document.getElementById("progreso") as HTMLDivElement;
    progreso.style.width = 0+"%";*/
    this.obtenerListaPreciosActual();
  }
  ngAfterViewInit(): void {
    
  }
  obtenerListaPreciosActual(){
    this.mostrarCargandoDatos = true;
    this.listapreciosactual = new Array();
    this.dataSource2 = new MatTableDataSource(this.listapreciosactual);
    this.preciosService.obtenerPrecios().subscribe(res=>{

      this.listapreciosactual = res as any[];
      this.displayedColumns2 = ["idArticulo","Descripcion","PrecioCompraSinIGV","Precio Venta","Precio Venta Minimo","Descuento","Editar"];
      this.dataSource2 = new MatTableDataSource(this.listapreciosactual);
      this.dataSource2.paginator = this.paginator.toArray()[1];
      this.dataSource2.sort = this.sort.toArray()[1];
      this.mostrarCargandoDatos = false;
      
    });
  }
  cambioPrecios(){
    console.log(this.sinPrecios);
  }


  guardarListaPrecios(){
    console.log(this.fechavigenciaPrecios);
    this.mostrarCargandoNuevaListaPrecios = true;
    this.mostrarListaPrecios = false;
    this.preciosService.guardarPreciosVenta({precios:this.listaprecios,fechavigencia:this.fechavigenciaPrecios})
    .subscribe(res=>{
      this.mostrarCargandoNuevaListaPrecios = false;
      this.abrirDialogoCarga(res);
    });
  }
  descargarExcel(){
    console.log("decargnado excel");
    var sinprecios = 0;
    if(this.sinPrecios){
      sinprecios = 1;
    }
    this.preciosService.descargarBaseExcel(sinprecios).subscribe(res=>{
      var data: any = res;
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      var url = window.URL.createObjectURL(blob);
      var anchor = document.createElement("a");
      anchor.download = "Lista de precios.xlsx";
      anchor.href = url;
      anchor.click();
    });    
  }

  mostrarNuevaLista(){
    if(this.mostrarFormulario){
      this.mostrarFormulario = false;
      this.obtenerListaPreciosActual();
    }
    else{
      this.mostrarFormulario = true;
      this.mostrarCargandoNuevaListaPrecios = false;
      this.cancelarProceso();
      //this.mostrarListaPrecios = false;
    }
  }
  abrirDialogoPrecio(datosprecio){
    datosprecio.fechavigencia = new Date();
    const dialogRef = this.dialog.open(DialogoPrecioComponent, {
      width: '520px',
      data: datosprecio,
      disableClose: true
    });
    console.log(datosprecio);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log("HAY DATOS ");  
        this.preciosService.actualizarPrecios(result).subscribe(res=>{
          console.log(res);
          this.abrirDialogoCarga(res);
        });
      }else{
        console.log("CANCELO");
      }
    });
  }
  abrirDialogoCarga(resultado){
    const dialogRef = this.dialog.open(DialogoResultadoComponent, {
      width: '450px',
      data:resultado,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.estado == 1){
        this.mostrarFormulario = false;
        //this.obtenerListaPreciosActual();
      }
    });
  }

  abrirDialogo(){
    document.getElementById("input_excel").click();

  }
  eligioArchivo(evento){
    var input = document.getElementById("input_excel") as HTMLInputElement;
    if(input.value != ""){
      this.nombreArchivoSeleccionado = input.value.replace(/C:\\fakepath\\/i, '');
      this.selectedFile = evento.target.files[0];    
      this.mostrarOpciones = true;   
      this.mostrarProceso = false;
      this.progreso = 0; 
      this.disabledbtnFile= true;

    }else{
      this.mostrarOpciones = false;   
      this.mostrarProceso = false;
    }
  }
  cancelarProceso(){
    this.mostrarOpciones = false;   
    this.mostrarProceso = false;
    this.progreso = 0; 
    this.disabledbtnFile= false;
    this.mostrarListaPrecios = false;
    var inputfile = document.getElementById("input_excel") as HTMLInputElement;
    inputfile.value = "";
  }
  procesarExcel(){
    //evento.preventDefault();
    this.mostrarOpciones = false;
    this.mostrarProceso = true;
    const fd = new FormData();
    this.mensajeestado = "Subiendo...";
    fd.append('excel',this.selectedFile, this.selectedFile.name);
    this.http.post(this.URL_API,fd,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          console.log("Subiendo "+ Math.round(event.loaded/event.total*100)+" %");
          //progreso.style.width = Math.round(event.loaded/event.total*100)+"%";
          this.progreso = event.loaded/event.total*100;         
          
          if(Math.round(event.loaded/event.total*100) == 100){
            this.mensajeestado = "Completado";
          }
        
        }else{
          if(event.type === HttpEventType.Response){
            this.listaprecios = event.body as any[];
            this.displayedColumns = this.listaprecios[0];
            this.listaprecios.splice(0, 1);  
            this.dataSource = new MatTableDataSource(this.listaprecios);
            this.dataSource.paginator = this.paginator.toArray()[0];
            this.dataSource.sort = this.sort.toArray()[0];
            this.mostrarListaPrecios= true;
            //console.log(listaprecios);           
          }
        }
      }
    );

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  mostrarListaPlanes(res){
    console.log(res);

  }
}