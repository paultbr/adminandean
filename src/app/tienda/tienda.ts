export class Tienda {

  constructor(_id = '', nombre = '', latitud = 0, longitud = 0){
    this._id        = _id;
    this.nombre     = nombre;
    this.latitud    = latitud;
    this.longitud   = longitud;
  }

  _id       : string;
  nombre    : string;
  latitud   : number;
  longitud  : number;
}
