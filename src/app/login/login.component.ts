import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Respuesta } from '../usuario/respuesta';
import { Router } from '@angular/router';
import { SesionService } from '../usuario/sesion.service';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Usuario } from './usuario';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [''],
  providers: [ LoginService ]
})
export class LoginComponent implements OnInit {

  constructor(public loginService: LoginService,public usuarioService:UsuarioService, public router: Router, public sesionService: SesionService, public snackBar: MatSnackBar) {  }

  ngOnInit() {
    /*this.sesionService.obtenerSesion().subscribe(res => {
      const respuesta = res as Respuesta;
      if( respuesta.status){
        this.router.navigate(['/menu']);
      }
    });*/
    if(this.usuarioService.logueado()){
      this.router.navigate(['/menu']);
    }
    
      
  }

  /**
   * Método para iniciar sesión como administrador, verifica la base de datos del CELSYS
   * @param form : formulario con el usuario y contraseña
   */
  login(form?: NgForm) {
    this.loginService.login(form.value).subscribe(res =>{
      const respuesta = res as any;
      if(respuesta.status){
        localStorage.setItem('admin_session_token',respuesta.session_token);
        localStorage.setItem('admin_session_token_exp',respuesta.session_token_exp);
        localStorage.setItem('admin_refresh_token',respuesta.refresh_token);
        localStorage.setItem('admin_refresh_token_exp',respuesta.refresh_token_exp);

        this.openSnackBar(respuesta.status, respuesta.msg);
        this.router.navigate(['/menu']);
        //location.reload();
      } else {
        this.openSnackBar(respuesta.status, respuesta.error);
        this.resetForm(form)
      }
    });
  }

  /**
   * Método que muestra un Bar temporal para confirmar los mensajes de éxito y de error
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }

  /**
   * Método para limpiar los campos del formulario de inicio de sesión
   * @param form : formulario a limpiar
   */
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.loginService.usuarioSeleccionado = new Usuario();
    }
  }
}
