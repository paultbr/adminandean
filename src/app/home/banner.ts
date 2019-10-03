export class ArticuloBanner {
    constructor(id='',url='',titulo='', categoria='',idprecio='',cantidad=0,imagenes=[],equipoplan=null){
        this.idarticulo=id;
        this.url=url;
        this.titulo=titulo;
        this.categoria = categoria;
        this.idprecio = idprecio;
        this.cantidad = cantidad;
        this.imagenes = imagenes;
        this.precioplan = equipoplan;

    }
    
    idarticulo:string;
    url:string;
    titulo:string;
    categoria:string;
    idprecio:string;
    cantidad:number;
    imagenes: String[];
    precioplan:any;

}
export class Banner {
    constructor(_id=null,imagen='',articulos=[]){
        this._id=_id;
        this.imagen=imagen;
        this.articulos=new Array();
    }    
    _id:string;
    imagen:string;
    articulos:ArticuloBanner[];
}
