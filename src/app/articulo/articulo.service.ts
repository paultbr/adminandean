import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'
import { Articulo } from './articulo';
import { ArticuloMysql } from './articuloMysql';
import { Equipo } from './equipo';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  articuloSeleccionadoMysql: ArticuloMysql = new ArticuloMysql();
  articuloSeleccionado: Articulo = new Articulo();
  articulosMysql: ArticuloMysql[];
  listaArticulos: Articulo[];
  equipos: Equipo[] = new Array();

  constructor(public http: HttpClient) {
    this.articuloSeleccionadoMysql = new ArticuloMysql();
  }

  getArticulosMysql(){
    return this.http.get(Constantes.URL_API_ARTICULO, {withCredentials: true})
  }

  getImagenes(){
    return this.http.get(Constantes.URL_API_IMAGEN, {withCredentials: true});
  }

  getArticulo(idarticulo: string){
    return this.http.get(Constantes.URL_API_ARTICULO+'/'+idarticulo, {withCredentials: true});
  }

  getPreciosArticulo(nombreequipo: string, linea:string, tipoplan:string, cuotas:string){
    return this.http.get(Constantes.URL_API_PLANES +'/planesequipo/'+nombreequipo +'/'+linea+'/'+tipoplan+'/'+cuotas, {withCredentials: true});
  }

  getEquiposArticulo(opcion){
    return this.http.get(Constantes.URL_API_ARTICULO+"/equipos/"+this.articuloSeleccionado.idarticulo+"/"+opcion,{withCredentials:true});
  }

  postArticulo(articulo: Articulo){
    return this.http.post(Constantes.URL_API_ARTICULO,articulo, {withCredentials: true});
  }

  postCarteles(carteles){
    return this.http.post(Constantes.URL_API_ARTICULO + '/cartel', {cards: carteles}, {withCredentials: true});
  }
  
  putArticulo(articulo: Articulo){
    return this.http.put(Constantes.URL_API_ARTICULO+'/'+articulo._id,articulo, {withCredentials: true});
  }

  getArticulos(){
    return this.http.get(Constantes.URL_API_ARTICULO + '/mongo/', {withCredentials: true});
  }

  getCarteles(){
    return this.http.get(Constantes.URL_API_ARTICULO + '/cartel',{withCredentials: true});
  }
  
  postBanners(banners){
    return this.http.post(Constantes.URL_API_ARTICULO + '/banner', {banners: banners}, {withCredentials: true});
  }

  getBanners(){
    return this.http.get(Constantes.URL_API_ARTICULO + '/banners/banners',{withCredentials: true});
  } 

  eliminarCartel(id: string) {
    return this.http.delete(Constantes.URL_API_ARTICULO + '/cartel/' + id, { withCredentials: true});
  }
}
