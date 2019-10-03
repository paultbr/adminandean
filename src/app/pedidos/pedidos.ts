export interface temarti {
    idarticulo: String,
    titulo: String,
    url: String,
    categoria: String,
    marca: String,
    cantidad: String,
    idprecio: String,
    especificaciones: String,
    caracteristicas: String,
    imagenes: String,
    descripcion: String,
    garantias: String,
    cuotainicial: String,
    cuotamensual: String,
    cuotas: String,
    montomes: String,
    nombreplan: String,
    precio: String,
    tipolinea: String,
    tipoplan: String,
}
export interface temdoc {
    Tipo: String,
    Serie: String,
    Numero: String,
}
export class Pedidos {
    constructor(_id = '', idUsuario = '',Correocliente='', Articulo = null, FechaCompra = new Date(), EstadoPago = '', idDireccion = '', idTipoPago = '', NroPedido = '', EstadoEnvio = '', FechaEnvio = new Date(), FechaEntrega = new Date(), PrecioTotal = '', NroTransaccion = '', Documento = null, idVendedor = '') {
        this._id = _id;
        this.idUsuario = idUsuario;
        this.Correocliente=Correocliente;
        this.Articulo = Articulo;
        this.FechaCompra = FechaCompra;
        this.EstadoPago = EstadoPago;
        this.idDireccion = idDireccion;
        this.idTipoPago = idTipoPago;
        this.NroPedido = NroPedido;
        this.EstadoEnvio = EstadoEnvio;
        this.FechaEnvio = FechaEnvio;
        this.FechaEntrega = FechaEntrega;
        this.PrecioTotal = PrecioTotal;
        this.NroTransaccion = NroTransaccion;
        this.Documento = Documento;
        this.idVendedor = idVendedor;
    }
    _id: string;
    idUsuario: string;
    Correocliente:string;
    Articulo: temarti[];
    FechaCompra: Date;
    EstadoPago: string;
    idDireccion: string;
    idTipoPago: string;
    NroPedido: string;
    EstadoEnvio: string;
    FechaEnvio: Date;
    FechaEntrega: Date;
    PrecioTotal: string;
    NroTransaccion: string;
    Documento: temdoc[];
    idVendedor: string;
}
