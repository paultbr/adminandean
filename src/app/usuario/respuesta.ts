export class Respuesta {

  constructor(status = false, msg = '', error = '', data : any, data2 : any) {
    this.status = status;
    this.msg = msg;
    this.error = error;
    this.data = data;
    this.data2 = data2;
  }

  status  : boolean;
  msg     : string;
  error   : string;
  data    : any;
  data2   : any;
}