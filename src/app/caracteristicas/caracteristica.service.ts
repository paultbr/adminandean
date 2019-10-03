import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Caracteristica } from './caracteristica';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaService {

  caracteristicaSelected: Caracteristica;
  caracteristicas: Caracteristica[];

  constructor(public http: HttpClient) {
    this.caracteristicaSelected = new Caracteristica();
  }

  /**
   * Método para agregar una nueva característica
   * @param caracteristica : datos de la característica
   */
  postCaracteristica(caracteristica: Caracteristica): Observable < any > {
    return this.http.post < Caracteristica > (Constantes.URL_API_CARACTERISTICA, caracteristica, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError < Caracteristica > ('postUsuario'))
    );
  }

  /**
   * Método para obtener todas las características
   */
  getCaracteristicas(): Observable < any > {
    return this.http.get < Caracteristica[] > (Constantes.URL_API_CARACTERISTICA).pipe(
      catchError(this.handleError('getCaracteristicas', []))
    );
  }

  /**
   * Método para modificar los datos de una característica
   * @param caracteristica : datos de la característica
   */
  putCaracteristica(caracteristica: Caracteristica): Observable < any > {
    return this.http.put(Constantes.URL_API_CARACTERISTICA + `/${caracteristica._id}`, caracteristica, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError < any > ('putUsuario'))
    );
  }

  /**
   * Método para eliminar una característíca
   * @param caracteristica : datos de la característica
   */
  deleteCaracteristica(caracteristica: Caracteristica): Observable < any > {
    return this.http.delete < Caracteristica > (Constantes.URL_API_CARACTERISTICA + `/${caracteristica._id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError < Caracteristica > ('deleteCaracteristica'))
    );
  }

  /**
   * Manejador de errores
   * @param operation 
   * @param result 
   */
  private handleError < T > (operation = 'operation', result ? : T) {
    return (error: any): Observable < T > => {
      console.error(error);
      return of(result as T)
    };
  }
}