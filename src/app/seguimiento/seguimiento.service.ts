import { Injectable } from '@angular/core';
import {Pedidos} from '../pedidos/pedidos';
import { Constantes } from '../constantes';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  seguimientoselec:Pedidos =new Pedidos();
  seguimientoPed:Pedidos[];

  constructor(public http: HttpClient) { }

  recuperarpedidoscorreo(correo:string){
    return this.http.get(Constantes.URL_API_PAGO+'/pedidos/cliente/'+correo);
  }
  recuperarpedidonro(num:string){
    return this.http.get(Constantes.URL_API_PAGO+'/consul/ped/'+num);
  }
}
