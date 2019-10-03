export class Caracteristica {

  constructor(_id = null, nombre = '', medida = ''){
    this._id = _id;
    this.nombre = nombre;
    this.medida = medida;
  }

  _id: string;
  nombre: string;
  medida: string;
}
