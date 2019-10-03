import { Constantes } from './../constantes';
import { HttpClient } from '@angular/common/http';
import { Distribuidormysql } from './distribuidormysql';
import { Injectable } from '@angular/core';
import { Distribuidor} from './distribuidor';


@Injectable({
  providedIn: 'root'
})
export class DistribuidorService {
  distriselecmysql:Distribuidormysql=new Distribuidormysql();
  distriMysql:Distribuidormysql[];
  distriselec:Distribuidor=new Distribuidor();

  constructor(private http:HttpClient) { 
    this.distriselecmysql= new Distribuidormysql();
    this.distriselec=new Distribuidor();
  }

  listardistrimysql(){
    return this.http.get(Constantes.URL_API_DISTRI, {withCredentials: true});
  }
  putDistribuidor(distri:Distribuidor){
    return this.http.put(Constantes.URL_API_DISTRI + `/${distri._id}`,distri, {withCredentials: true} )

  }
}
