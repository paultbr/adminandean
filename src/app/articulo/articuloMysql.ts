export class ArticuloMysql {

    constructor(idArticulo = '', Descripcion = '',Cantidad=0, Categoria='', Estado='' ) {
        this.idArticulo = idArticulo;
        this.Descripcion = Descripcion;
        this.Cantidad = Cantidad;
        this.Categoria = Categoria;
        this.Estado = Estado;
    }
  
    idArticulo: string;
    Descripcion: string;
    Cantidad: Number;
    Categoria: string;
    Estado: string;
  }