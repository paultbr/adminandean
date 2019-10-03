import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Direccion } from './direccion';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  dirSelected : Direccion;
  direcciones : Direccion[];

  readonly URL_API = Constantes.URL_API_DIRECCION;

  constructor(private http: HttpClient) {
    this.dirSelected = new Direccion();
  }

  postDireccion(direccion : Direccion){
    return this.http.post(this.URL_API, direccion, {withCredentials: true});
  }
  
  getDirecciones(direccion: string){
    return this.http.get(this.URL_API + `/${direccion}`, {withCredentials: true});
  }

  putDireccion(direccion :  Direccion){
    return this.http.put(this.URL_API + `/${direccion._id}`, direccion, {withCredentials: true});
  }

  deleteDireccion(_id : string) {
    return this.http.delete(this.URL_API + `/${_id}`, {withCredentials: true});
  }
}
