import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Miga } from '../miga';
import { SesionService } from '../usuario/sesion.service';

@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {
  sesionService           : SesionService;
  displayedColumns: string[] = ['nombre', 'latitud', 'longitud', 'edit'];
  dataSource              : MatTableDataSource<any>;
  miga                    : Miga = new Miga('Sesión','sesiones');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(sesionService: SesionService) {
    this.sesionService = sesionService;
  }

  ngOnInit() {
    this.sesionService.getSesiones().subscribe( res => {
      console.log(res);
    });
  }

  aplicarFiltro(filtro: string){
    this.dataSource.filter = filtro.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
