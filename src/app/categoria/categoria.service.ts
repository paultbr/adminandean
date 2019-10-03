import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'
import { Categoria } from './categoria';

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {

  categoriaSeleccionada: Categoria = new Categoria();
  categorias: Categoria[];

  constructor(public http: HttpClient){
    this.categoriaSeleccionada = new Categoria();
  }

  getCategorias(){
    return this.http.get(Constantes.URL_API_CATEGORIA, {withCredentials: true})
  }
  
  getSubCategorias(id: string){
    return this.http.get(Constantes.URL_API_CATEGORIA+'/subcategorias/'+id, {withCredentials: true})
  }

  getCategoriasHijos() {
    return this.http.get(Constantes.URL_API_CATEGORIA+ '/subs', {withCredentials: true});
  }

  postCategoria(Categoria: Categoria){
    return this.http.post(Constantes.URL_API_CATEGORIA,Categoria, {withCredentials: true});
  }
  
  putCategoria(categoria: Categoria){
    return this.http.put(Constantes.URL_API_CATEGORIA+'/'+categoria._id,categoria, {withCredentials: true});
  }

  deleteCategoria(id: string){
    return this.http.delete(Constantes.URL_API_CATEGORIA+'/'+id, {withCredentials: true});
  }
  
}
