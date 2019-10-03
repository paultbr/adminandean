import { Articulo } from './../articulo/articulo';
import { Component, OnInit } from '@angular/core';
import { SeguimientoService } from './seguimiento.service';
import { Pedidos } from '../pedidos/pedidos';
import { PedidosService } from '../pedidos/pedidos.service';
import { Miga } from '../miga';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  datcorreo: string = '';
  datnroped: string = '';
  arreglopedidos: any;
  arregloarti:any;
  estadoenv: string = '';
  public migas = [ new Miga('Seguimiento','/home')];

  constructor(public seguimientoservice: SeguimientoService, public pedidosservice: PedidosService) { }

  ngOnInit() {
  }

  consultar() {
    if (this.datcorreo != '') {
      console.log(this.datcorreo);
      this.consultaporcorreo(this.datcorreo);

    }
    else {
      if (this.datnroped != '') {
        console.log(this.datnroped);
        document.getElementById('datosSeg').hidden = false;
        this.consultapornroped(this.datnroped);
      }
      else {
        alert('NO SE INGRESO NINGUN DATO !!!!')
      }
    }
  }
  consultaporcorreo(correo: string) {
    this.seguimientoservice.recuperarpedidoscorreo(correo)
      .subscribe(res => {
        this.arreglopedidos = JSON.parse(JSON.stringify(res));
        document.getElementById('datosSeg').hidden = false;
      });

  }
  consultapornroped(num:string) {
    console.log('entra');
    this.seguimientoservice.recuperarpedidonro(num)
    .subscribe(res=>{
      console.log(res);
      this.arreglopedidos = JSON.parse(JSON.stringify(res));
        document.getElementById('datosSeg').hidden = false;
    });
  }
  actualizar(i: number) {
    console.log(this.estadoenv);
    this.arreglopedidos[i].EstadoEnvio = this.estadoenv;
    this.arreglopedidos[i].FechaEntrega=new Date();
    console.log(this.arreglopedidos[i]);
    this.pedidosservice.actualizarpedido2(this.arreglopedidos[i])
      .subscribe(res => {
        console.log(res);
      });
  }

  verartic(id:string){
    console.log(id);
    this.arregloarti=this.arreglopedidos[id].Articulo;
    console.log(this.arregloarti);
  }

}
