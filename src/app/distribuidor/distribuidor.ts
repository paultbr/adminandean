export class Distribuidor {
    constructor(_id='',idProveedorRUC='',RazonSocial='',NombreRepresentante='',DNIRepresentante='',Telefono='',CorreoElectronico='',Web='',Ciudad='',Direccion='',Estado=''){
        this._id=_id;
        this.idProveedorRUC=idProveedorRUC;
        this.RazonSocial=RazonSocial;
        this.NombreRepresentante=NombreRepresentante;
        this.DNIRepresentante=DNIRepresentante;
        this.Telefono=Telefono;
        this.CorreoElectronico=CorreoElectronico;
        this.Web=Web;
        this.Ciudad=Ciudad;
        this.Direccion=Direccion;
        this.Estado=Estado;
    }

    _id:string;
    idProveedorRUC:string;
    RazonSocial:string;
    NombreRepresentante:string;
    DNIRepresentante:string;
    Telefono:string;
    CorreoElectronico:string;
    Web:string;
    Ciudad:string;
    Direccion:string;
    Estado:string;
}
