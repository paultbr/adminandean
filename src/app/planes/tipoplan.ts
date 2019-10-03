import {Plan} from './plan';
export class TipoPlan {

    constructor(_id = null, tipo = '', planes = []) {
        this._id = _id;
        this.tipo = tipo;
        this.planes = planes;
    }
  
    _id: string;
    tipo: string;
    planes: Plan[];
  }