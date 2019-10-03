export class Marca {
    constructor(_id=null,nombremarca='',descripcion='', imagen = ''){
        this._id=_id;
        this.nombremarca=nombremarca;
        this.imagen=imagen;
        this.descripcion=descripcion;
    }

    
    _id:string;
    nombremarca:string;
    descripcion:string;
    imagen:string;
}
