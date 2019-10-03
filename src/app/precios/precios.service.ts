import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  constructor(public http: HttpClient) { }


  obtenerPrecios(){
    return this.http.get(Constantes.URL_API_PRECIOS,{withCredentials: true});
  }
  obtenerPrecioArticulo(idarticuloglobal){
    return this.http.get(Constantes.URL_API_PRECIOS+ '/obtener-precio/'+idarticuloglobal, {withCredentials: true});

  }
  descargarBaseExcel(opcion){
    return this.http.get(Constantes.URL_API_PRECIOS+ '/generar-reporte-excel/'+opcion, {withCredentials: true,responseType: 'blob'});
  }
  guardarPreciosVenta(data){
    return this.http.post(Constantes.URL_API_PRECIOS+ '/guardar-lista-precios',data, {withCredentials: true});

  }
  actualizarPrecios(datos){
    return this.http.post(Constantes.URL_API_PRECIOS+"/actualizar-precio", datos,{withCredentials: true});
  }
}
