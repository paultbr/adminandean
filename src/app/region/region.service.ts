import { Constantes } from '../constantes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Region } from './region';
import { Provincia } from './provincia';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  departamentoSelected : Region;
  provinciaSelected : Provincia;
  distritoSelected : string;
  regiones : Region[];
  provincias : Provincia[];
  distritos : string[];

  readonly URL_API = Constantes.ULR_API_REGION;

  constructor(private http : HttpClient) {
    this.departamentoSelected = new Region();
    this.provinciaSelected = new Provincia();
  }

  postRegion(region : Region){
    return this.http.post(this.URL_API, region, {withCredentials: true});
  }

  getRegiones(){
    return this.http.get(this.URL_API, {withCredentials: true});
  }

  putRegion(region: Region){
    return this.http.put(this.URL_API + `/${region._id}`, region, {withCredentials: true});
  }

  deleteRegion(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`, {withCredentials: true});
  }
}
