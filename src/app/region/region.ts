import {Provincia} from './provincia';

export class Region {
  
  constructor(_id = null, departamento = '', provincias = []){
    this._id = _id;
    this.departamento = departamento;
    this.provincias = provincias;
  }

  _id: string;
  departamento : string;
  provincias : Provincia[];

}