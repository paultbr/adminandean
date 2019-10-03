import { MarcaMysql } from './marca-mysql';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Constantes} from '../constantes'
import { Marca } from './marca';


@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  marcaselectmysql:MarcaMysql=new MarcaMysql();
  marcaselect:Marca=new Marca();
  marcaMysql:MarcaMysql[];
  marcas: Marca[];

  constructor(private http:HttpClient) { 
    this.marcaselectmysql= new MarcaMysql();
  }
  
  listarmarcamysql(){
    return this.http.get(Constantes.URL_API_MARCA, {withCredentials: true});
  }
  postMarca(Marca:Marca){//agregar empleados post
    return this.http.post(Constantes.URL_API_MARCA,Marca, {withCredentials: true});
  }
  getMarcas(){
    return this.http.get(Constantes.URL_API_MARCA_MONGODB, {withCredentials: true})
  }
  getMarcaMongo(id){
    return this.http.get(Constantes.URL_API_MARCA_MONGODB+"/"+id,{withCredentials: true});
  }

}
