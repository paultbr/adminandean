import { CaracteristicaItem} from './caracteristica';
import { Equipo }  from './equipo';

export class Articulo {

    constructor( _id=null,idarticulo = '', titulo = '',url='', categoria = '',marca='',cantidad=0, idprecio = '', caracteristicas= '', imagenes=[], descripcion='', garantias='', equipos=[], palabrasclaves='', seo='') {
        this.idarticulo = idarticulo;
        this.titulo = titulo;
        this.url = url;
        this.categoria = categoria;
        this.caracteristicas = caracteristicas;
        this.imagenes = imagenes;
        this.descripcion = descripcion;
        this.garantias = garantias;
        this.marca = marca;
        this.equipos = equipos;
        this.palabrasclaves = palabrasclaves;
        this.descuento = 0;
        this.seodescripcion = seo;
    }
  
    _id: string;
    idarticulo: string;
    titulo: string;
    url: string;
    categoria: string;
    marca: string;
    cantidad: Number;
    especificaciones: string[];
    caracteristicas:string;
    imagenes: string[];
    descripcion: string;
    garantias: string;
    equipos: Equipo[];
    palabrasclaves: string;
    descuento: Number;
    seodescripcion: string;
  }