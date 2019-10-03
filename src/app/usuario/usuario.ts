export class Usuario {

  constructor(_id = '',tipoDocumento = '', numeroDocumento = '' ,correo = '', nombres = '', apellidos = '', password = '', sexo= '',fechaNacimiento = undefined, promociones = false) {
      this._id = _id;
      this.tipoDocumento = tipoDocumento;
      this.numeroDocumento = numeroDocumento;
      this.correo = correo;
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.password = password;
      this.sexo = sexo;
      this.fechaNacimiento = fechaNacimiento;
      this.promociones = promociones;
  }

  _id: string;
  tipoDocumento : string;
  numeroDocumento : string;
  correo: string;
  nombres: string;
  apellidos: string;
  password: string;
  sexo : string;
  fechaNacimiento : Date;
  promociones: boolean;
}