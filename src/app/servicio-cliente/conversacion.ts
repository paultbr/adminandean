export class Conversacion {
  _id             : string;
  nombreCliente   : string;
  email           : string;
  tipoConsulta    : string;
  consulta        : string;
  createdAt       : Date;
  concluido       : boolean;
  unir            : boolean = false;
  participantes   : string[] = [];
  
  constructor(_id= '', nombreCliente = '', email = '', tipoConsulta = '', consulta = ''){
    this._id = _id;
    this.nombreCliente = nombreCliente;
    this.email = email;
    this.tipoConsulta = tipoConsulta;
    this.consulta = consulta;
  }
}