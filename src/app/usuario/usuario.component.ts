import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Direccion } from './direccion';
import { DireccionService } from './direccion.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { Miga } from '../miga';
import { NgForm } from '@angular/forms';
import { Provincia } from '../region/provincia';
import { Region } from '../region/region';
import { RegionService } from '../region/region.service';
import { Respuesta } from '../usuario/respuesta';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [ UsuarioService, 
    {provide: MAT_DATE_LOCALE, useValue: 'es-PE'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS} ]
})

export class UsuarioComponent implements  OnInit {

  step                              : number = 1;
  migas                             = [new Miga('Clientes','usuarios')]
  mostrarDireccion                  : boolean = false;
  mostrarListaDirecciones           : boolean = false;
  mostrarMensajeCliente             : boolean = false;
  mostrarUsuarioForm                : boolean = false;
  tiposDocumento                    : string[];
  tiposVivienda                     : string[] = [ 'Casa', 'Oficina', 'Departamento', 'Edificio', 'Condominio', 'Otro'];
  usuarioDataSource                 : MatTableDataSource<Usuario>;
  direccionDataSource               : MatTableDataSource<Direccion>;
  @ViewChild(MatPaginator) upaginator: MatPaginator;
  @ViewChild(MatSort) usort         : MatSort;
  @ViewChild(MatPaginator) dpaginator: MatPaginator;
  @ViewChild(MatSort) dsort         : MatSort;
  @ViewChild(MatTable) table        : MatTable<any>;
  usuarioColumns: string[] = ['correo', 'nombres', 'documento', 'afiliacion', 'edit'];
  direccionColumns: string[] = ['direccion', 'departamento', 'provincia', 'distrito', 'edit'];
  modificar : boolean = false;
  
  /**
   * Constructor del componente Usuario
   * @param usuarioService 
   * @param flashMessage 
   * @param direccionService 
   * @param regionService 
   */
  constructor(public adapter: DateAdapter<any>,public usuarioService : UsuarioService, public direccionService : DireccionService, public regionService : RegionService, public snackBar: MatSnackBar) {
      this.adapter.setLocale('es');
     }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit() {
    this.tiposDocumento = ['DNI'];
    this.getUsuarios();
  }

  /**
   * Método que agrega una nueva dirección a un usuario
   * @param form : formulario de dirección
   */
  agregarDireccion(form ? : NgForm) {
    form.value.usuario = this.usuarioService.usuarioSeleccionado._id;
    if (form.value._id) {
      this.direccionService.putDireccion(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if (respuesta.status) {
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.mostrarDireccion = false;
        } else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      });
    } else {
      this.direccionService.postDireccion(form.value).subscribe(res => {
        const respuesta = res as Respuesta;
        if (respuesta.status) {
          this.openSnackBar(respuesta.status, respuesta.msg);
          this.mostrarDireccion = false;
          this.direccionService.direcciones.push(respuesta.data as Direccion);
        } else {
          this.openSnackBar(respuesta.status, respuesta.error);
        }
      });
    }
  }

  /**
   * Método que agrega un nuevo usuario
   * @param form 
   */
  agregarUsuario(form ? : NgForm) {
    var validacion: boolean = true;
    var mensaje: string;
    form.value.correo = this.usuarioService.usuarioSeleccionado.correo;
    if (form.value.numeroDocumento == null || form.value.nombres == null || form.value.apellidos == null || form.value.correo == null || form.value.tipoDocumento == null || form.value.fechaNacimiento == null || form.value.sexo == null) {
      mensaje = 'Algunos campos del formulario no estan debidamente completados';
      validacion = false;
    }
    if (form.value.tipoDocumento == 'DNI') {
      var dni: string = form.value.numeroDocumento ? form.value.numeroDocumento : '';
      if (dni.length != 8) {
        validacion = false;
        mensaje = 'El número de documento no es válido, un DNI sólo tiene 8 dígitos.';
      }
    }
    if (validacion) {
      if (form.value._id) {
        this.usuarioService.putUsuario(form.value).subscribe(res => {
          const respuesta = res as Respuesta;
          if (respuesta.status) {
            this.openSnackBar(respuesta.status, respuesta.msg);
            this.resetForm(form);
            this.getUsuarios();
          } else {
            this.openSnackBar(respuesta.status, respuesta.error);
          }
        });
      } else {
        form.value.password = form.value.numeroDocumento;
        this.usuarioService.postUsuario(form.value).subscribe(res => {
          const respuesta = res as Respuesta;
          if (respuesta.status) {
            this.openSnackBar(respuesta.status, respuesta.msg);
            this.getUsuarios();
            this.resetForm(form);
          } else {
            this.openSnackBar(respuesta.status, respuesta.error);
          }
        });
      }
    } else {
      this.openSnackBar(false, mensaje);
    }
  }

  /**
   * Método para filtrar la tabla de datos
   * @param filtro 
   */
  aplicarFiltro(filtro: string){
    this.usuarioDataSource.filter = filtro.trim().toLowerCase();
    if (this.usuarioDataSource.paginator) {
      this.usuarioDataSource.paginator.firstPage();
    }
  }

  /**
   * Método que selecciona un departamento 
   * @param departamento 
   */
  departamento_selected(departamento: string) {
    var i: number = 0;
    while (this.regionService.regiones[i].departamento != departamento) {
      i = i + 1;
    }
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    this.regionService.provinciaSelected = new Provincia(undefined, "", []);
  }

  /**
   * Método que muestra el formulario para editar una dirección
   * @param direccion 
   */
  editarDireccion(direccion: Direccion) {
    var i = 0;
    while (this.regionService.regiones[i].departamento != direccion.departamento) {
      i++
    }
    this.regionService.departamentoSelected = this.regionService.regiones[i];
    i = 0;
    while (this.regionService.departamentoSelected.provincias[i].provincia != direccion.provincia) {
      i++
    }
    this.regionService.provinciaSelected = this.regionService.departamentoSelected.provincias[i];
    this.direccionService.dirSelected = direccion;
    this.mostrarDireccion = true;
  }

  /**
   * Método que muestra el formulario para editar un usuario
   * @param usuario 
   */
  editarUsuario(usuario: Usuario) {
    this.usuarioService.usuarioSeleccionado = usuario;
    this.mostrarUsuarioForm = true;
    this.mostrarListaDirecciones = true;
    this.getDirecciones(this.usuarioService.usuarioSeleccionado._id);
    this.getRegiones();
    this.step = 0;
  }

  /**
   * Método que obtiene las direcciones de un usuario
   * @param correo 
   */
  getDirecciones(correo: string) {
    this.direccionService.getDirecciones(correo).subscribe(res => {
      this.direccionService.direcciones = res as Direccion[];
      this.direccionDataSource = new MatTableDataSource(this.direccionService.direcciones);
      this.direccionDataSource.paginator = this.dpaginator;
      this.direccionDataSource.sort = this.dsort;
    })
  }

  /**
   * Método que muestra los usuarios de la base de datos
   */
  getUsuarios() {
    this.mostrarUsuarioForm = false;
    this.mostrarDireccion = false;
    this.mostrarListaDirecciones = false;
    this.usuarioService.getUsuarios().subscribe(res => {
      this.usuarioService.usuarios = res as Usuario[];
      this.usuarioDataSource = new MatTableDataSource(this.usuarioService.usuarios);
      this.usuarioDataSource.paginator = this.upaginator;
      this.usuarioDataSource.sort = this.usort;
    });
  }

  /**
   * Método que obtiene las regiones o departamentos
   */
  getRegiones() {
    this.regionService.getRegiones().subscribe(res => {
      this.regionService.regiones = res as Region[];
    })
  }

  /**
   * Método que muestra el formulario de una nueva dirección
   * @param form 
   * @param usuario 
   */
  nueva_direccion(form ? : NgForm, usuario ? : string) {
    this.direccionService.dirSelected = new Direccion();
    this.resetDireccionForm(form);
    this.mostrarDireccion = true;
    this.direccionService.dirSelected.usuario = usuario;
  }

  nuevoUsuario(step: number){
    this.step = 0;
    this.usuarioService.usuarioSeleccionado = new Usuario();
  }

  /**
   * Método que muestra un Bar temporal para confirmar los mensajes de éxito y de error
   */
  openSnackBar(status: boolean, mensaje: string): void {
    var clase = status ? 'exito' : 'error';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 3000,
      panelClass: [clase],
      data: mensaje
    });
  }

  /**
   * Método que muestra los distritos de una provincia seleccionada
   * @param provincia 
   */
  provincia_selected(provincia: string) {
    var i: number = 0;
    while (this.regionService.departamentoSelected.provincias[i].provincia != provincia) {
      i = i + 1;
    }
    this.regionService.provinciaSelected = this.regionService.departamentoSelected.provincias[i];
  }

  /**
   * Método que vuelve a cargar el formulario de dirección
   * @param form 
   */
  resetDireccionForm(form ? : NgForm) {
    if (form) {
      this.direccionService.dirSelected = new Direccion();
      form.reset();
    }
  }

  /**
   * Método que vuelve a cargar el formulario de usuario
   * @param form 
   */
  resetForm(form ? : NgForm) {
    if (form) {
      this.usuarioService.usuarioSeleccionado = new Usuario();
      form.reset();
    }
  }

  /**
   * Cambia el panel a mostrar
   * @param step : número del panel
   */
  setStep(step: number){
    this.step = step;
  }

}
