import { catchError} from 'rxjs/operators';
import { Constantes } from '../constantes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tienda } from './tienda';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  tiendas          : Tienda[]   = [];
  tienda           : Tienda;

  constructor(public http: HttpClient) { 
    this.tienda = new Tienda();
  }

  /**
   * Método para agregar una nueva tienda
   * @param tienda : datos de la tienda
   */
  postTienda(tienda: Tienda): Observable<any>{
    return this.http.post<Tienda>(Constantes.URL_API_TIENDA, tienda, {withCredentials: true}).pipe(
      catchError(this.manejarError<Tienda>('postTienda'))
    );
  }

  /**
   * Método que obtiene todas las tiendas de la base de datos
   */
  getTiendas() : Observable<any>{
    return this.http.get<Tienda[]>(Constantes.URL_API_TIENDA, {withCredentials: true}).pipe(
      catchError(this.manejarError('getTiendas',[]))
    );
  }

  /**
   * Método para actualizar los datos de una tienda
   * @param tienda : datos de la tienda
   */
  putTienda(tienda: Tienda): Observable<any>{
    return this.http.put<Tienda>(Constantes.URL_API_TIENDA + `/${tienda._id}`, tienda, {withCredentials: true}).pipe(
      catchError(this.manejarError<any>('putTienda'))
    );
  }

  /**
   * Método para eliminar una tienda
   * @param _id : identificador de la tienda
   */
  deleteTienda(_id: string): Observable<Tienda>{
    return this.http.delete<Tienda>(Constantes.URL_API_TIENDA +  `/${_id}`, {withCredentials: true}).pipe(
      catchError(this.manejarError<any>('deleteTienda'))
    );
  }

  /**
   * Manejador de las operaciones
   * @param operacion 
   * @param resultado 
   */
  private manejarError<T> (operacion = 'operacion', resultado?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(resultado as T);
    };
  }

}
