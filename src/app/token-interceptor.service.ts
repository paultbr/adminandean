import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario/usuario.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(public usuarioService: UsuarioService, public router : Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    console.log("EJECUTANDOSE INTERCEPTOR");
    let tokenizedReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${this.usuarioService.getToken()}`
      }
    });
    return next.handle(tokenizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){//No autorizado
          this.handle401error(req, next);
        }
        return throwError(error);
    }));; 
  }
  handle401error(req, next){    
    this.router.navigate(['/login']);     
  }
}
