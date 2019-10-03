export class Equipo{
    constructor(idequipo='', descripcion='', cantidad=0,color='',detalle='',imagen=''){
        this.idequipo = idequipo;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.detalle = detalle;
        this.imagen = imagen;
        this.precioventa = 0;
        //this.precioreferencial = 0;
    }
    idequipo: string;
    descripcion: string;
    cantidad: Number;
    detalle: string;
    imagen: string;
    precioventa:Number;
  //  precioreferencial: Number;
}