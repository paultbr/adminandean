import { Component, OnInit } from '@angular/core';
import { ServicioClienteService} from './servicio-cliente.service'
import { MensajeChat} from './mensaje-chat';
import { Miga } from '../miga';
import { Conversacion } from './conversacion';

@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.component.html',
  styleUrls: ['./servicio-cliente.component.css']
})
export class ServicioClienteComponent implements OnInit {
  migas             = [new Miga('Servicio al Cliente', '/servicio-cliente')];
  listaMensajesChat : MensajeChat[] = new Array();
  ocultarBotonChat  : boolean       = true;
  ocultarEnviarMensaje : boolean    = true;
  fecha  = new Date();

  constructor(public servicioClienteService: ServicioClienteService) { }

  ngOnInit() {
    this.servicioClienteService.obtenerConversacionesEntre(
      this.fecha.getDate().toString().length == 2 ? this.fecha.getDate().toString() : '0' + this.fecha.getDate().toString(), 
      this.fecha.getMonth().toString().length == 2 ? this.fecha.getMonth().toString() : '0' + this.fecha.getMonth().toString(), 
      this.fecha.getFullYear().toString()).subscribe( res => {
      const rspta = JSON.parse(JSON.stringify(res));
      if (rspta.status) {
        this.servicioClienteService.agregarLista(this.fecha, rspta.data as Conversacion[]);
        this.servicioClienteService.conversaciones = rspta.data  as Conversacion[];
        this.servicioClienteService.nombreUsuario = rspta.usuario;
        this.servicioClienteService.tipoUsuario = rspta.tipoUsuario;
        this.servicioClienteService.idUsuario = rspta.idUsuario;
        for(var i = 0; i < this.servicioClienteService.conversaciones.length; i++){
          if(this.servicioClienteService.conversaciones[i].participantes.includes(this.servicioClienteService.idUsuario)){
            this.servicioClienteService.conversaciones[i].unir = true;
          }
        }
      }
    });
    // Cuando alguien intenta iniciar conversacion
    this.servicioClienteService.iniciarChat().subscribe( res => {
      this.servicioClienteService.obtenerConversaciones().subscribe( convs =>{
        var jres = JSON.parse(JSON.stringify(convs));
        if (jres.status){
          this.servicioClienteService.conversaciones = jres.data as Conversacion[];
        }
      });
    });
    //Al recibir nuevos mensajes
    this.servicioClienteService.nuevoMensaje().subscribe(res=>{
      var mensaje = res as MensajeChat;
      if(mensaje.cuerpo == '$desconectar$'){
        if(mensaje.conversacionId == this.servicioClienteService.chatSeleccionado._id){
          this.agregarMensaje(new MensajeChat('','Esta sesión ha terminado', '$desconectar','admin'));
        }
      }else {
        if(mensaje.conversacionId == this.servicioClienteService.chatSeleccionado._id){
          this.agregarMensaje(mensaje);
        }
      }     
    });
  }

  verificarMensaje(event){
    if(event.code=="Enter" && !event.shiftKey){
      var inputmensaje = document.getElementById("contenidomensaje") as HTMLInputElement;
      if(inputmensaje.value != ""){
        var mensaje = new MensajeChat(this.servicioClienteService.chatSeleccionado._id, inputmensaje.value, "admin", this.servicioClienteService.chatSeleccionado.email);
        this.enviarMensaje(mensaje);
        inputmensaje.value = "";
      }
    }
  }

  agregarMensaje(mensaje: MensajeChat){
    const tiempo  = Date.now();
    mensaje.tiempo = tiempo;
    this.listaMensajesChat.push(mensaje);
  }

  enviarMensaje(mensaje: MensajeChat){
    this.servicioClienteService.enviarMensaje(mensaje);
    this.agregarMensaje(mensaje);
  }

  mostrarMensajes(conversacion : Conversacion){
    this.ocultarBotonChat = false;
    this.servicioClienteService.chatSeleccionado = conversacion;
    this.servicioClienteService.obtenerMensajes(conversacion._id).subscribe( res => {
      var jres = JSON.parse(JSON.stringify(res));
      if( jres.status){
        this.listaMensajesChat = jres.data as MensajeChat[];
      }
    });
  }

  MoverScroll(chatPrincipal: HTMLDivElement) {
    chatPrincipal.scrollTop = chatPrincipal.scrollHeight;
  }

  obtenerChats(){
    this.fecha = new Date(this.fecha.getTime() - 24 * 60 * 60 * 1000);
    this.servicioClienteService.obtenerConversacionesEntre(
      this.fecha.getDate().toString().length == 2 ? this.fecha.getDate().toString() : '0' + this.fecha.getDate().toString(), 
      this.fecha.getMonth().toString().length == 2 ? this.fecha.getMonth().toString() : '0' + this.fecha.getMonth().toString(), 
      this.fecha.getFullYear().toString()).subscribe( res => {
      const rspta = JSON.parse(JSON.stringify(res));
      if (rspta.status) {
        this.servicioClienteService.agregarLista(this.fecha, rspta.data as Conversacion[]);
      }
    });
  }

  unirseChat(){
    const mensaje = new MensajeChat(this.servicioClienteService.chatSeleccionado._id, this.servicioClienteService.nombreUsuario.split(' ')[0] + ' se ha unido al chat', '$unirChat', this.servicioClienteService.chatSeleccionado.email);
    this.servicioClienteService.chatSeleccionado.unir = true;
    this.servicioClienteService.unirseChat(mensaje);
    this.ocultarBotonChat = true;
  }
} 
