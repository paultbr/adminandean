import { Precios } from './../planes/precios';
import { Articulo } from './../articulo/articulo';
import { Respuesta } from './../usuario/respuesta';
import { Usuario } from './../login/usuario';
import { UsuarioService } from './../usuario/usuario.service';
import { Component, OnInit } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, from } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { MatSnackBar, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Miga } from '../miga';
import { PedidosService } from './pedidos.service';
import { Pedidos } from './pedidos';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { DialogoCargoComponent } from '../cargo/dialogo-cargo/dialogo-cargo.component';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { CargoService } from '../cargo/cargo.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';

export interface PedidosData {
  _id: string;
  idUsuario: string;
  entrega: string;
  fecha: string;
  pago: string;
  total: string;
  estado: string;
  direccion: string;
  Colorfila: string;
}


export interface temdoc {
  Tipo: String,
  Serie: String,
  Numero: String,
}

export interface datosventamysql {
  tipocomprobante: string,
  seriecomprobante: string,
  pNroComprobante: string,
  pFechaVenta: string,
  pFechaRegistro: string,
  pEsVentaAlContad: number,
  pIdEmpleado: string,
  pIdLocal: string,
  pIdCliente: string,
  pEsCancelad: number,
  pImprimirGui: number,
  pMontoPagado: any,
  pPrecioVentaTotal: any,
  pIGVTotal: any,
  pRedondeo: any,
  pIdNivelCliente: string,
  pIdLineaProducto: string,
  pUsarNivel: number,
  pObservacion: string,
  pMontoPagadoReal: any
}

export interface detalleventamysql {
  pIdLocal: string,
  pTipoComprobante: string,
  pSerieComprobante: string,
  pNroComprobante: string,
  pIdArticulo: string,
  pIdNroSerieArticulo: string,
  pCantidad: number,
  pPrecioVenta: any,
  pDsctoCliente: any,
  pIdDsctoEspecial: string,
  pDsctoEspecial: any,
  pDsctoNivel4: any,
  pIdTipoPlan: string
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  providers: [PedidosService]
})
export class PedidosComponent implements AfterViewInit, OnDestroy, OnInit {
  router: Router;
  idPedido: string = '';
  textofiltro: string = '';
  //table 2
  displayedColumns: string[] = ['_id', 'Correocliente', 'entrega', 'fecha', 'pago', 'total', 'estado', 'btn'];
  dataSource: MatTableDataSource<PedidosData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //
  //datatable
  /*@ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  dtTriggers2: Subject<any> = new Subject();
  flag: boolean = true;*/
  //fin
  idempleado: string = '';
  fecha = new Date(Date.now());
  listapedidos: any;
  listapedidouni: any;
  Articuloarreglo = new Array();
  tempoidarti: string = '';
  textseries: string = '';
  lisraseries: any; //= new Array();
  listaseries2 = new Array();
  temguardarserie = new Array();
  guardarseries = new Array();
  listpruebaseries = new Array();
  arreglocliente: any;
  cliente: string;
  clientesuser: string;
  doccliente: string;
  listadireccion: any;
  direccionenvio: string;
  estadoenvio: string;
  fechacompra: string;
  fechaenvio: string;
  estadopago: string;
  tipopago: string;
  nrotrans: string;
  numeropedido: string;
  preciototal: number = 0;
  preciototalcarritos: number = 0;
  totalcarritos: number = 0;
  carPagados: number = 0;
  carProceso: number = 0;
  carReembolso: number = 0;
  carErrorPago: number = 0;
  tipodoc: string = '';
  seriedoc: string = '';
  numerodoc: string = '';
  //arreglo para guardar en mysql
  arreglomysql: datosventamysql[];
  detalleventmysql: detalleventamysql[];
  mensajemysql: string = 'HECHO';
  //
  indiceArt: number = 0;
  serieselec: string;

  onSelection(e, v) {
    this.serieselec = e.option.value;
    //  console.log(e.option.value)
    this.temguardarserie.push(this.serieselec);
  }
  cancelarseries() {
    this.temguardarserie = [];
    this.guardarseries = [];
  }
  guardarSeries() {
    this.guardarseries = [];
    this.guardarseries = this.temguardarserie;
    this.temguardarserie = [];
    //  console.log(this.guardarseries);
    //var modal=document.getElementById('exampleModal');
    this.textseries = this.guardarseries.join('-');
    console.log(this.textseries);
    document.getElementById('btncerrar').click();
    this.listpruebaseries[this.indiceArt] = this.textseries;
  }


  //mensaje alert
  mensajeestado: string;
  DocumentoAct: temdoc[] = [{ Tipo: 'BBV', Serie: '1', Numero: '0001' }];
  //fin
  // tabla material
  listpedidos: any[] = new Array();/* [
    { numeroped: '12', cliente: 'paul', entrega: '57%', fecha: '2019-01-12', pago: 'proceso', total: '1250', estado: 'yellow' },
    { numeroped: '12', cliente: 'paul', entrega: '57%', fecha: '2019-01-12', pago: 'proceso', total: '1250', estado: 'yellow' }
  ];*/
  //
  //datos temp
  listadatos: string[] = ['datos1', 'datos2', 'datos3', 'datos4', 'datos5', 'dtos6', 'datos7'];
  migas = [new Miga('Pedidos', '/pedidos')];
  //fin datos temp
  constructor(public snackBar: MatSnackBar, public http: HttpClient, public pedidosservice: PedidosService, public usuarioservice: UsuarioService, public dialog: MatDialog, public cargoService: CargoService) {
    //table material
    // Assign the data to the data source for the table to render   JSON.parse(JSON.stringify(this.listpedidos))
    //  console.log(datos);
    //console.log(JSON.parse(JSON.stringify(this.listpedidos)));
    this.dataSource = new MatTableDataSource(this.listpedidos);
    //
  }

  ngOnInit() {
    document.getElementById('tablapedidos').focus();
    //table material
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //
    document.getElementById('dettallepedido').hidden = true;
    document.getElementById('tabladetallepedido').hidden = true;
    document.getElementById('divnombrecliente').hidden = true;
    this.listarpedidost();
    //datatable
    /* this.dtOptions = {
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
     this.applyFilter('');*/
    this.pedidosservice.recuperarsesion()
      .subscribe(res => {
        var resp = JSON.parse(JSON.stringify(res));
        //console.log(resp.dato);
        this.idempleado = resp.dato;
      });
  }
  //table material
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //
  /* data table*/
  ngAfterViewInit(): void {
    /* this.dtTriggers.next();
     this.dtTriggers2.next();*/
    //console.log(this.pedidosservice.pedidos);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    /* this.dtTriggers.unsubscribe();
     this.dtTriggers2.unsubscribe();*/
  }

  /* rerender(): void {
     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.destroy();
       this.dtTriggers.next();
     });
   }*/
  cambiarvista(id: string, iduser: string, iddireccion: string, preciot: number) {
    document.getElementById('listapedidos').hidden = true;
    document.getElementById('dettallepedido').hidden = false;
    document.getElementById('tablapedido').hidden = true;
    document.getElementById('tabladetallepedido').hidden = false;
    document.getElementById('divnombrecliente').hidden = false;
    this.recuperarpedido(id);
    this.recuperarnombrecliente(iduser);
    this.recuperardireccion(iddireccion);
    this.preciototal = preciot;
    this.idPedido = id;
    //this.recuperarserie();
  }
  cambiarvista2() {
    document.getElementById('listapedidos').hidden = false;
    document.getElementById('dettallepedido').hidden = true;
    document.getElementById('tablapedido').hidden = false;
    document.getElementById('tabladetallepedido').hidden = true;
    document.getElementById('divnombrecliente').hidden = true;
  }
  cambiarestado() {
    document.getElementById('extadoselect').style.color = 'red'
    var optselect = document.getElementById('selectestado') as HTMLSelectElement;
    var idselect = optselect.value;
    console.log(idselect);
    document.getElementById('extadoselect').innerHTML = optselect.options[optselect.selectedIndex].text;
    this.estadoenvio = optselect.options[optselect.selectedIndex].text;
    // this.mensajeestado = optselect.options[optselect.selectedIndex].text;
  }
  cambiarestadopago() {
    document.getElementById('extadoselect2').style.color = 'red'
    var optselect = document.getElementById('selectestadopago') as HTMLSelectElement;
    var idselect = optselect.value;
    document.getElementById('extadoselect2').innerHTML = optselect.options[optselect.selectedIndex].text;
    this.estadopago = optselect.options[optselect.selectedIndex].text;
    // this.mensajeestado = optselect.options[optselect.selectedIndex].text;
  }
  actualizar() {
    this.snackBar.open('Estado Actualizado de Envio ->>', this.estadoenvio + '🧓🏻', {
      duration: 2000,
    });
    document.getElementById('extadoselect').style.color = 'black';

  }
  actualizar2() {
    this.snackBar.open('Estado Actualizado de Pago ->>', this.estadopago + '🧓🏻', {
      duration: 2000,
    });
    document.getElementById('extadoselect2').style.color = 'black';

  }
  //
  recuperarserie() {
    console.log('serie');
    this.pedidosservice.recuperarserielocal()
      .subscribe(res => {
        // this.seriedoc=JSON.parse(JSON.stringify(res));
        console.log(res);
        //console.log(this.seriedoc);
      });
  }
  listarpedidost() {
    this.pedidosservice.listarpedidos()
      .subscribe(res => {
        this.pedidosservice.pedidos = res as Pedidos[];
        this.listapedidos = JSON.parse(JSON.stringify(res));
        console.log(this.listapedidos);
        this.totalcarritos = this.pedidosservice.pedidos.length;
        for (var j = 0; j < this.pedidosservice.pedidos.length; j++) {
          /*color */
          var color = 'white';
          if (this.pedidosservice.pedidos[j].EstadoEnvio == 'Proceso') {
            color = 'white';
          }
          if (this.pedidosservice.pedidos[j].EstadoEnvio == 'Enviado') {
            color = '#F3F293';
          }
          if (this.pedidosservice.pedidos[j].EstadoEnvio == 'Entregado') {
            color = '#CEF6CE';
          }
          if (this.pedidosservice.pedidos[j].EstadoEnvio == 'Devolucion') {
            color = '#F6CECE';
          }
          //console.log(color);
          /*fin color */
          this.preciototalcarritos = this.preciototalcarritos + Number(this.pedidosservice.pedidos[j].PrecioTotal)
          this.listpedidos.push({ _id: this.pedidosservice.pedidos[j]._id, Correocliente: this.pedidosservice.pedidos[j].Correocliente, entrega: this.pedidosservice.pedidos[j].EstadoEnvio, fecha: this.pedidosservice.pedidos[j].FechaCompra, pago: this.pedidosservice.pedidos[j].idTipoPago, total: this.pedidosservice.pedidos[j].PrecioTotal, estado: this.pedidosservice.pedidos[j].EstadoPago, idUsuario: this.pedidosservice.pedidos[j].idUsuario, direccion: this.pedidosservice.pedidos[j].idDireccion, Colorfila: color });
        }
        // this.dataSource = new MatTableDataSource(this.listpedidos);
        this.filtrarCarritos('1');
        this.funcionprueba();
        console.log(this.listpedidos)
      });
  }
  /* recuperarnombre(id: string) {
     this.usuarioservice.listarusuario(id)
       .subscribe(res => {
         var Respuesta2 = JSON.parse(JSON.stringify(res));
         this.cliente = Respuesta2.nombres;
         console.log(this.cliente)//+''+Respuesta2.apellidos;
       });
   }*/

  recuperarnombrecliente(id: string) {
    this.usuarioservice.listarusuario(id)
      .subscribe(res => {
        var Respuesta2 = JSON.parse(JSON.stringify(res));
        this.cliente = Respuesta2.nombres + ' ' + Respuesta2.apellidos;
        this.clientesuser = Respuesta2.correo;
        this.arreglocliente = Respuesta2;
        this.recuperarnrodocCliente(id);
      });
  }
  recuperarnrodocCliente(id: string) {
    this.usuarioservice.recuperardoccliente(id)
      .subscribe(res => {
        this.doccliente = JSON.parse(JSON.stringify(res));
        console.log('cliente n°: ' + this.doccliente);
      });
  }

  recuperarpedido(id: string) {
    console.log(id);
    this.pedidosservice.listarpedidouni(id)
      .subscribe(res => {
        console.log(res);
        this.listapedidouni = JSON.parse(JSON.stringify(res));
        console.log(this.listapedidouni);
        this.estadoenvio = this.listapedidouni[0].EstadoEnvio;
        this.fechacompra = this.listapedidouni[0].FechaCompra;
        this.fechaenvio = this.fecha.toString();
        this.estadopago = this.listapedidouni[0].EstadoPago;
        this.tipopago = this.listapedidouni[0].idTipoPago;
        this.nrotrans = this.listapedidouni[0].NroTransaccion;
        this.Articuloarreglo = this.listapedidouni[0].Articulo;
        this.listpruebaseries = new Array(this.Articuloarreglo.length).fill(' ');
        this.tipodoc = this.listapedidouni[0].Documento[0].Tipo;
        this.seriedoc = this.listapedidouni[0].Documento[0].Serie;
        this.numerodoc = this.listapedidouni[0].Documento[0].Numero;
        this.numeropedido = this.listapedidouni[0].NroPedido;
        //  this.listararticulos();
      });
  }//944091466
  recuperarseries(id: string, ind: number) {
    this.tempoidarti = id;
    this.indiceArt = ind;
    this.listaseries2 = [];
    this.pedidosservice.recuperarseriesart(id)
      .subscribe(res => {
        this.lisraseries = JSON.parse(JSON.stringify(res));
        console.log(this.lisraseries);
        for (var i = 0; i < Object.keys(res).length; i++) {
          this.listaseries2.push(this.lisraseries[i].serie);
        }
        console.log(this.listaseries2);
      });

  }
  recuperardireccion(id: string) {
    this.pedidosservice.recuperardireccion(id)
      .subscribe(res => {
        this.listadireccion = JSON.parse(JSON.stringify(res));
        this.direccionenvio = this.listadireccion.direccion;
      });
  }
  anularventaMongoMysql() {
    this.listapedidouni[0].EstadoPago = 'Devolucion';
    this.listapedidouni[0].EstadoEnvio = 'Reembolso';
    //actualizar moongo
    this.pedidosservice.GuardarPagomysql(this.arreglomysql)
      .subscribe(res => {
        var tempo = JSON.parse(JSON.stringify(res));
        console.log(res);
        this.mensajemysql = tempo[0][0].Mensaje;
        console.log(this.mensajemysql);
        if (this.mensajemysql == 'HECHO') {
          this.actualizarexistenciamysql();
          if (this.mensajemysql == 'HECHO') {
            this.anularventmysql();
          }
        }
      });
    //
  }
  anularventamongo() {

  }
  actualizarexistenciamysql() {
    var pIdLocalMvto = '611';
    var pIdTipoDocumento = this.tipodoc;
    var pSerie = this.seriedoc;
    var pNro = this.numerodoc;
    var pIdArticulo;
    var pSerieArticulo;
    var pCantidad;

  }
  anularventmysql() {
  }
  actualizarpedidoartiseries(id: string, idart: string, serieart: string) {
    console.log(serieart);
    var art = {
      id: id,
      idart: idart,
      serieart: serieart,
    }
    console.log(art);
    this.pedidosservice.actualizarserieart(art)
      .subscribe(res => {
        console.log(res);
      });
  }
  actualizarpago() {
    var id = this.listapedidouni._id;
    /*   this.DocumentoAct[0].Tipo = this.tipodoc;
       this.DocumentoAct[0].Serie = this.seriedoc;
       this.DocumentoAct[0].Numero = this.numerodoc;
       this.listapedidouni.Documento = this.DocumentoAct;
       console.log(this.DocumentoAct);*/
    this.listapedidouni[0].EstadoPago = this.estadopago;
    this.listapedidouni[0].EstadoEnvio = this.estadoenvio;
    this.guardarmyql();
    /*guardar mysql-mongo */
    this.pedidosservice.GuardarPagomysql(this.arreglomysql)
      .subscribe(res => {
        var tempo = JSON.parse(JSON.stringify(res));
        this.mensajemysql = tempo[0][0].Mensaje;
        /* this.mensajemysql='HECHO'; */
        if (this.mensajemysql == 'HECHO') {
          this.guardarmysqldetalle();
        }
        else {
          this.snackBar.open('Error!!' + this.mensajemysql, '🧓🏻', {
            duration: 2000,
          });
        }
      });
    /*fin guardar*/
  }
  guardarmyql() {
    console.log('entra mysql');
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    var fecha_actual = String(anio + "-" + mes + "-" + dia);
    var fechacom = new Date(this.fechacompra);
    var compradia = fechacom.getDate();
    var comprames = fechacom.getMonth() + 1;
    var compraanio = fechacom.getFullYear();
    var fecha_compra = String(compraanio + "-" + comprames + "-" + compradia);
    this.arreglomysql = [{
      tipocomprobante: this.tipodoc,
      seriecomprobante: this.seriedoc,
      pNroComprobante: this.numerodoc,
      pFechaVenta: fecha_compra,
      pFechaRegistro: fecha_actual,
      pEsVentaAlContad: 1,
      pIdEmpleado: this.idempleado,
      pIdLocal: '611',
      pIdCliente: this.doccliente,
      pEsCancelad: 1,
      pImprimirGui: 0,
      pMontoPagado: this.preciototal,
      pPrecioVentaTotal: this.preciototal,
      pIGVTotal: (this.preciototal - (this.preciototal / 1.18)),
      pRedondeo: this.preciototal,
      pIdNivelCliente: '6',
      pIdLineaProducto: '5',
      pUsarNivel: 0,
      pObservacion: ' ',
      pMontoPagadoReal: this.preciototal
    }];
  }
  guardarmysqldetalle() {
    /*console.log('seriessss');
    console.log( this.listpruebaseries);
    console.log(this.Articuloarreglo);*/
    //this.Articuloarreglo
    for (var i = 0; i < this.Articuloarreglo.length; i++) {
      var idart = this.Articuloarreglo[i].idarticulo;
      var precio = this.Articuloarreglo[i].precio;
      var arreglotem = this.listpruebaseries[i];
      var arregloseries = arreglotem.split('-');
      var serieartact= arregloseries[0];
      this.actualizarpedidoartiseries(this.listapedidouni[0]._id,idart,serieartact);
      for (var j = 0; j < arregloseries.length; j++) {
        var jj=j;
        this.detalleventmysql = [{
          pIdLocal: '611',
          pTipoComprobante: this.tipodoc,
          pSerieComprobante: this.seriedoc,
          pNroComprobante: this.numerodoc,
          pIdArticulo: idart,
          pIdNroSerieArticulo: arregloseries[j],
          pCantidad: 1,
          pPrecioVenta: precio,
          pDsctoCliente: 0,
          pIdDsctoEspecial: 'DSCTONULO',
          pDsctoEspecial: 0,
          pDsctoNivel4: 5,
          pIdTipoPlan: '1',
        }];
        this.pedidosservice.GuardarDetallemysql(this.detalleventmysql)
          .subscribe(res => {
            var tempo = JSON.parse(JSON.stringify(res));
            this.mensajemysql = tempo[0][0].Mensaje;
            /* this.mensajemysql='HECHO'; */
            if (this.mensajemysql == 'HECHO') {
              this.pedidosservice.actualizarpedido(this.listapedidouni)
                .subscribe(res => {
                  /* this.actualizarpedidoartiseries(this.listapedidouni[0]._id,idart,serieartact); */
                  console.log(res);
                  //  this.actualiazrcantidadArti(idart,)
                  this.snackBar.open('Pago Guardado', '🧓🏻', {
                    duration: 2000,
                  });
                });
            }
            else {
              this.snackBar.open('Error!!' + res, '🧓🏻', {
                duration: 2000,
              });
            }
          });
      }
    }

  }
  actualiazrcantidadArti(idart: string, serie: string, cantidad: string) {
    var articuloarr = {
      id: idart,
      seriearti: serie,
      cantidad: cantidad,
    }
    this.pedidosservice.actualizarcantidad(articuloarr)
      .subscribe(res => {
        console.log(res);
      })
  }
  filtrarCarritos(id: string) {
    if (id == '1') {
      this.applyFilter('');
    }
    if (id == '2') {
      this.applyFilter('Pagado');
    }
    if (id == '3') {
      this.applyFilter('Proceso');
    }
    if (id == '4') {
      this.applyFilter('Reembolso');
    }
    if (id == '5') {
      this.applyFilter('Error de Pago');
    }
  }


  funcionprueba() {
    var arr = new Array(),//[2, 1, 3, 2, 8, 9, 1, 3, 1, 1, 1, 2, 24, 25, 67, 10, 54, 2, 1, 9, 8, 1],
      ArrOrdenado = [],
      count = 1;
    for (var k = 0; k < this.listpedidos.length; k++) {
      arr.push(this.listpedidos[k].estado);
    }
    console.log(arr);
    ArrOrdenado = arr.sort(function (a, b) {
      return a - b
    });
    for (var i = 0; i < ArrOrdenado.length; i = i + count) {
      count = 1;
      for (var j = i + 1; j < ArrOrdenado.length; j++) {
        if (ArrOrdenado[i] === ArrOrdenado[j])
          count++;
      }
      console.log(ArrOrdenado[i] + " = " + count);
      if (ArrOrdenado[i] == 'Pagado') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carPagados = count;
      }
      if (ArrOrdenado[i] == 'Proceso') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carProceso = count;
      }
      if (ArrOrdenado[i] == 'Reembolso') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carReembolso = count;
      }
      if (ArrOrdenado[i] == 'Error de pago') {
        console.log(ArrOrdenado[i] + " = " + count);
        this.carErrorPago = count;
      }
    }
  }

  /**
   * Método para visualizar la información del cargo realizado
   * @param idCargo : identificador del cargo realizado
   */
  verCargo(idCargo: string) {
    this.dialog.open(DialogoCargoComponent, {
      width: '640px',
      data: {
        id: idCargo
      }
    });
  }

  /**
   * Método que permite anular una venta realizada, devolviendo el monto al cliente y anulando la boleta emitida
   * @param idCargo : identificador del cargo realizado
   */
  anularVenta(idCargo: string) {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      data: {
        titulo: 'Mensaje de Confirmación para Anular Venta',
        mensaje: '¿Está seguro de anular la venta realizada? Este proceso es irreversible, una vez anulado la venta el dinero de compra retorna al cliente y el artículo vuelve al inventario. Además que la anulación es dentro de los 7 días realizado la venta.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargoService.devolverCargo(this.preciototal.toString(), this.nrotrans, 'solicitud_comprador').subscribe(res => {
          const rspta = res as Respuesta;
          if (rspta.status) {
            this.openSnackBar(rspta.status, rspta.msg);
            console.log(rspta.data);
          } else {
            this.openSnackBar(rspta.status, rspta.error);
          }
        });
      }
    });
    this.anularventaMongoMysql();
    this.anularventamongo();
  }
  /**
   * Método que muestra un bar temporal con un mensaje
   * @param status : indica si es un error o confirmación
   * @param mensaje : texto del mensaje
   */
  openSnackBar(status: boolean, mensaje: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [status ? 'exito' : 'error'],
      data: mensaje
    });
  }
}