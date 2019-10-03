export class Marca {
    constructor(_id=null,idMarca='',nombre='',descripcion='', imagen = ''){
        this._id=_id;
        this.idMarca=idMarca;
        this.nombremarca=nombre;
        this.imagen=imagen;
        this.descripcion=descripcion;
    }

    
    _id:string;
    idMarca:string;
    nombremarca:string;
    descripcion:string;
    imagen:string;
}
