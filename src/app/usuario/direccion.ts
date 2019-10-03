export class Direccion {

  constructor(_id = undefined, usuario = '', direccion = '', referencia = '', departamento = '', provincia = '', distrito = '', tipolocal = '', telefono = ''){
    this._id = _id;
    this.usuario = usuario;
    this.direccion = direccion;
    this.referencia = referencia;
    this.departamento = departamento;
    this.provincia = provincia;
    this.distrito = distrito;
    this.tipolocal = tipolocal;
    this.telefono = telefono;
  }

  _id : string;
  usuario : string;
  direccion : string;
  referencia : string;
  departamento : string;
  provincia : string;
  distrito : string;
  tipolocal: string;
  telefono: string;
}