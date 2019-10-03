export class Plan {

    constructor(_id = null,nombreplan = '', descripcion='') {
        this._id = _id;
        this.nombreplan = nombreplan;
        this.detalle = descripcion;
    }
    _id: string;
    nombreplan: string;
    detalle: string;
  }