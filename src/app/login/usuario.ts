export class Usuario {

  constructor(usuario = '', password = '') {
      this.usuario = usuario;
      this.password = password;
  }

  usuario : string;
  password : string;
  
}