import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Miga } from '../miga';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: ['']
})
export class BreadcrumbComponent implements OnInit {

  @Input() migas: Miga[];
  router : Router;

  constructor() {
   }

  ngOnInit() {

  }
}

