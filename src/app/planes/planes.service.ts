import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Constantes} from '../constantes';
import { TipoPlan} from './tipoplan';
import { Plan} from './plan';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  planes: Plan[];
  planSeleccionado: Plan = new Plan();
  constructor(private http: HttpClient) { 

  }

  getEquipos(){
    return this.http.get(Constantes.URL_API_PLANES, {withCredentials: true});
  }

 
  getPlanesEquipo(id: String){
    return this.http.get(Constantes.URL_API_PLANES +'/planesequipo/'+id +'/PREPAGO/ALTA/0', {withCredentials: true});
  }


  /* PLANES */
  getPlanes(){
    return this.http.get(Constantes.URL_API_PLANES+"/plan", {withCredentials: true}); 
  }
  putPlanes(){
    return this.http.put(Constantes.URL_API_PLANES+'/plan/'+this.planSeleccionado._id, this.planSeleccionado);
  }
  deletePlan(){
    return this.http.delete(Constantes.URL_API_PLANES+'/plan/del/'+this.planSeleccionado._id, {withCredentials: true});  
  }
}
