export class Precios {

    constructor(nombre = '', descripcion='') {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.equipos = null;
    }
  
    nombre: string;
    descripcion: string;
    tipo: string;
    equipos: [{
        nombreequipo: string;
        planes:[
            {
                nombreplan: string;
                precio: number;
            }
        ]
    }];
  }