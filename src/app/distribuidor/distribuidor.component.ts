import { Distribuidormysql } from './distribuidormysql';
import { Component, OnInit } from '@angular/core';
import { DistribuidorService } from './distribuidor.service';
import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { Subject } from 'rxjs';
import {HttpClient, HttpEventType} from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { Distribuidor } from './distribuidor';
import { Miga } from '../miga';

@Component({
  selector: 'app-distribuidor',
  templateUrl: './distribuidor.component.html',
  styleUrls: ['./distribuidor.component.css'],
  providers:[DistribuidorService]
})
export class DistribuidorComponent implements AfterViewInit,OnDestroy,OnInit {

  //datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();
  flag: boolean = true;
  migas = [new Miga('Distribuidores', '/distribuidor')]
  //fin

  constructor(public http: HttpClient,public distriService:DistribuidorService) { }

  ngOnInit() {
    //datatable
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };
    this.listardistri();
  }

  /* data table*/
  ngAfterViewInit(): void {
    this.dtTriggers.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTriggers.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTriggers.next();
    });
  }
  /*fin datatable*/
  listardistri(){
    document.getElementById("carga").hidden = false;
    document.getElementById("listardistri").hidden=true;
    this.distriService.listardistrimysql()
    .subscribe(res =>{
      this.distriService.distriMysql=res as Distribuidormysql[];

      if(this.distriService.distriMysql.length == 0){
        console.log("No se encontraron datos");
      }else{

        console.log("Exito..");
        document.getElementById("listardistri").hidden=false;
      }
      this.rerender();
      document.getElementById("carga").hidden = true;
    });
  }

  guardartemdatos(distrimysql:Distribuidormysql){
    console.log(distrimysql.RazonSocial);
    document.getElementById("titulomodal").innerHTML = "Actualizar datos para el distribuidor : "+distrimysql.RazonSocial;
  }
  actualizardistri(form:NgForm){
    this.distriService.putDistribuidor(form.value)
    .subscribe(res=>{
      this.resetForm(form);
      alert('Distribuidor Actualizado');
    })
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.distriService.distriselec = new Distribuidor();
    }
  }
}
