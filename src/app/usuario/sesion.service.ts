import { Constantes } from '../constantes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Respuesta } from './respuesta';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(public http: HttpClient, public router: Router) { }

  nuevaSesion(){
    return this.http.post<any>(Constantes.URL_API_SESION, localStorage, {withCredentials: true}).pipe(
      catchError(this.handleError<any>('postSesion'))
    );
  }

  getNotificaciones(){
    return this.http.get<any>(Constantes.URL_API + 'sesion/notificaciones', {withCredentials: true}).pipe(
      catchError(this.handleError<any>('getNotificaciones'))
    );
  }

  getSesiones(){
    return this.http.get<any>(Constantes.URL_API_SESION + '/sesiones', {withCredentials: true}).pipe(
      catchError(this.handleError<any>('getSesiones'))
    );
  }

  obtenerSesion(){
    return this.http.get<any>(Constantes.URL_API_SESION, { withCredentials: true }).pipe(
      catchError(this.handleError<any>('getSesion'))
    );
  }

  cerrarSesion(){
    return this.http.delete<any>(Constantes.URL_API_SESION, {withCredentials : true}).pipe(
      catchError(this.handleError<any>('deleteSesion'))
    );
  }

  verificarSesion() : boolean{
    var sesionIniciada : boolean;
    this.obtenerSesion().subscribe( res => {
      var rspta = res as Respuesta;
      sesionIniciada = rspta.status;
      console.log(sesionIniciada + '1');
    });
    return sesionIniciada;
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
