import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';
import { catchError} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  usuarioSeleccionado : Usuario;
  usuarios : Usuario[];
  readonly URL_API_SESSION = Constantes.URL_API_SESION;
  constructor(public http : HttpClient) {
    this.usuarioSeleccionado = new Usuario();
  }

  /**
   * Método para guardar los datos de un usuario
   * @param usuario 
   */
  postUsuario(usuario: Usuario): Observable<any> {
    return this.http.post<Usuario>(Constantes.URL_API_USUARIO, usuario, {withCredentials: true}).pipe(
      catchError(this.handleError<Usuario>('postUsuario'))
    );
  }

  /**
   * Método que obtiene toda la lista de usuarios
   */
  getUsuarios() : Observable<Usuario[]> {
    return this.http.get<Usuario[]>(Constantes.URL_API_USUARIO, {withCredentials: true})
      .pipe(
        catchError(this.handleError('getUsuarios',[]))
      );
  }

  /**
   * Método para actualizar los datos de un cliente
   * @param usuario : datos del cliente
   */
  putUsuario(usuario: Usuario) {
    return this.http.put(Constantes.URL_API_USUARIO + `/${usuario._id}`, usuario, {withCredentials: true}).pipe(
      catchError(this.handleError<any>('putUsuario'))
    );
  }

  /**
   * 
   * @param cliente 
   */
  listarusuario(cliente:string){
    return this.http.get(Constantes.URL_API_USUARIO+'/user/'+cliente);
  }

  recuperardoccliente(id:string){
    return this.http.get(Constantes.URL_API_USUARIO+'/clien/doc/'+id);
  }

  /**
   * Manejador de métodos
   * @param operation 
   * @param result 
   */
  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
  esTokenPublicoVigente(){
    return moment().isBefore(this.getExpiration());
  }
  esRefreshTokenVigente(){
    return moment().isBefore(this.getExpirationRefreshToken());
  }
  getExpirationRefreshToken() {
    const expiration = localStorage.getItem("admin_refresh_token_exp");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
  esSessionTokenVigente(){
    return moment().isBefore(this.getExpirationSessionToken());
  }
  getExpirationSessionToken() {
    const expiration = localStorage.getItem("admin_session_token_exp");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
  getExpiration() {
    const expiration = localStorage.getItem("admin_expires_pt");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
  getToken(){
    
    return localStorage.getItem('admin_session_token');
    
  }
  logueado(){
    return !!localStorage.getItem("admin_session_token");
  }
  async getNewSessionToken(){
    const res = await  this.http.post(this.URL_API_SESSION+'/newsessiontoken', {refresh_token: localStorage.getItem('admin_refresh_token')},{ withCredentials : true }).toPromise();
    return res;
  }
  logout(){
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_session_token_exp');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_refresh_token_exp');
  }
}
