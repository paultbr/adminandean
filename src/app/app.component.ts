import { Component, OnInit } from '@angular/core';
import { SesionService } from './usuario/sesion.service';
import { Respuesta } from './usuario/respuesta';
import { Router, NavigationEnd, Event } from '@angular/router';
import { UsuarioService } from './usuario/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ['']
})
export class AppComponent implements OnInit{

  constructor(public usuarioService: UsuarioService, public router: Router){
  }
  mostrarMenu = false;  

  ngOnInit(){
    this.router.events.subscribe((event: Event)=>{
      if (event instanceof NavigationEnd) {
        if(event.url == "/login"){
          this.mostrarMenu = false;
        }else{
          this.mostrarMenu = true;
        }
      }
    });
  }
  
}
