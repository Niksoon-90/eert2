import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-shipments',
  templateUrl: './data-shipments.component.html',
  styleUrls: ['./data-shipments.component.scss']
})
export class DataShipmentsComponent implements OnInit {
  products: any[]
  customers: any[];

  first = 0;

  rows = 10;
  constructor() { }

  ngOnInit(): void {
    this.products = [
      {id: 1, name: 'ОМК', year: '2015', userLoginAdd: 'Lol',  userFioAdd: 'Смирнов Иван Анатольевич'},
      {id: 2, name: 'ОМК2', year: '2016', userLoginAdd: 'Lol',  userFioAdd: 'Смирнов Иван Анатольевич'},
      {id: 3, name: 'ОМК3', year: '2015', userLoginAdd: 'Lol',  userFioAdd: 'Смирнов Иван Анатольевич'}
    ];
  }


  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.customers ? this.first === (this.customers.length - this.rows): true;
  }

  isFirstPage(): boolean {
    return this.customers ? this.first === 0 : true;
  }

}
