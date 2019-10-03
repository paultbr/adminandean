import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  constructor(public http: HttpClient) { }
  getArchivos(ruta){
    return this.http.post(Constantes.URL_API_IMAGEN+'/files',ruta, {withCredentials: true});
  }
  crearCarpeta(ruta, nombrecarpeta){
    return this.http.post(Constantes.URL_API_IMAGEN+'/crear-carpeta',{ruta:ruta, carpeta:nombrecarpeta}, {withCredentials: true});
  }
  eliminarArchivo(ruta){
    return this.http.post(Constantes.URL_API_IMAGEN+'/eliminar-archivo',{ruta:ruta}, {withCredentials: true});
  }
  eliminarCarpeta(ruta){
    return this.http.post(Constantes.URL_API_IMAGEN+'/eliminar-carpeta',{ruta:ruta}, {withCredentials: true});
  }
}
