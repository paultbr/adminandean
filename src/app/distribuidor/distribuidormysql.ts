export class Distribuidormysql {

    constructor(idProveedorRUC='',RazonSocial='',NombreRepresentante='',DNIRepresentante='',Telefono='',CorreoElectronico='',Web='',Ciudad='',Direccion='',Estado=''){
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

