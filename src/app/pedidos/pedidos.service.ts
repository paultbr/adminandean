import { Articulo } from './../articulo/articulo';
import { Injectable } from '@angular/core';
import { Pedidos } from './pedidos';
import { Constantes } from '../constantes';
import { HttpClient } from '@angular/common/http'

export interface articulArr{
  id:string,
  seriearti:string,
  cantidad:string,
}
export class arregloartex{
  id:string;
  idart:string;
  serieart:string;
}


@Injectable({
  providedIn: 'root'
})


export class PedidosService {
  pedidoselec: Pedidos = new Pedidos();
  pedidos: Pedidos[];

  constructor(public http: HttpClient) { }

  listarpedidos() {
    return this.http.get(Constantes.URL_API_PAGO);
  }
  actualizarpedido(pedido: Pedidos) {
    return this.http.put(Constantes.URL_API_PAGO + `/${pedido[0]._id}`, pedido);
  }
  actualizarpedido2(pedido: Pedidos) {
    return this.http.put(Constantes.URL_API_PAGO + "/actu2" + `/${pedido._id}`, pedido);
  }
  actualizarcantidad(artiarr:articulArr) {
    return this.http.put(Constantes.URL_API_PAGO + '/cantidad'+ `/${artiarr.id}`, artiarr);
  }
  actualizarserieart(arti:arregloartex){
    return this.http.put(Constantes.URL_API_PAGO + '/serieart'+ `/${arti.id}`, arti);
  }
  eliminarpedido(_id: string) {
    return this.http.delete(Constantes.URL_API_PAGO + `/${_id}`);
  }
  listarpedidouni(_id: string) {
    return this.http.get(Constantes.URL_API_PAGO + '/' + _id);
  }
  recuperardireccion(_id: string) {
    return this.http.get(Constantes.URL_API_DIRECCION + '/uni/' + _id);
  }
  recuperarserielocal() {
    return this.http.get(Constantes.URL_API_PAGO + '/serielocal/');
  }
  recuperarseriesart(idarti: string) {
    return this.http.get(Constantes.URL_API_PAGO + '/artic/series/' + idarti);
  }
  GuardarPagomysql(pago: any) {
    return this.http.post(Constantes.URL_API_PAGO + '/pagomysql/', pago, { withCredentials: true });
  }
  GuardarDetallemysql(pagodell: any) {
    return this.http.post(Constantes.URL_API_PAGO + '/detalle/', pagodell, { withCredentials: true });
  }
  recuperarsesion() {
    return this.http.get(Constantes.URL_API_SESION, { withCredentials: true });
  }
}
