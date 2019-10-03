import { Component, OnInit } from '@angular/core';
import { PlanesService} from './planes.service';
import { TipoPlan } from './tipoplan';
import { Plan } from './plan';
import { Miga } from '../miga';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent implements OnInit {
  migas = [new Miga('Planes', '/planes')];

  constructor( public planesService: PlanesService) { }

  ngOnInit() {
    this.getPlanes();
  }
  getPlanes(){
    this.planesService.getPlanes()
    .subscribe(res=>{
      this.planesService.planes = res as Plan[];
      console.log(this.planesService.planes);
    });
  }
  
  editarPlan(plan: Plan){
    this.planesService.planSeleccionado = plan;
    console.log(this.planesService.planSeleccionado);
  }
  guardarDatosPlan(){
    console.log(this.planesService.planSeleccionado);
    this.planesService.putPlanes()
    .subscribe(res=>{
      console.log(res);
      this.getPlanes();
      this.planesService.planSeleccionado = new Plan();
    });

  }
  eliminarPlan(plan: Plan){
    this.planesService.planSeleccionado = plan;
    
  }
  procesarEliminarPlan(){
    this.planesService.deletePlan()
    .subscribe(res=>{
      console.log(res);
      this.getPlanes();
      this.planesService.planSeleccionado = new Plan();
    });
  }

}
