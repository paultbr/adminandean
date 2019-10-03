import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constantes } from '../constantes';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(public http: HttpClient) { }

  getCargo(id: string){
    return this.http.get(Constantes.URL_PASARELA + '/' + id , {withCredentials: true});
  }

  getCargos(){
    return this.http.get(Constantes.URL_PASARELA, {withCredentials: true});
  }

  devolverCargo(monto: string, idCargo: string, razon: string){
    return this.http.post(Constantes.URL_PASARELA + '/devolucion',{amount : monto, charge_id: idCargo, reason: razon } ,{withCredentials: true});
  }
}
