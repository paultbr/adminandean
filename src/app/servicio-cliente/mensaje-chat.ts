export class MensajeChat {

    constructor(conversacionId = '', cuerpo = '', autor = '', destino = '') {
        this.conversacionId     = conversacionId;
        this.cuerpo             = cuerpo;
        this.autor              = autor;
        this.destino            = destino;
    }
  
    conversacionId  : string;
    cuerpo          : string;
    autor           : string;
    destino         : string;
    createdAt       : Date;
    tiempo          : number;
  }